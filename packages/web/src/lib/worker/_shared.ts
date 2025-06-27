import { getUUID } from '$utils'

export const WORKER_STATUS = {
	LOADING  : 'LOADING',
	ERROR    : 'ERROR',
	FINISHED : 'FINISHED',
} as const
export type WorkerStatusMap = typeof WORKER_STATUS
export type WorkerStatus = typeof WORKER_STATUS[keyof typeof WORKER_STATUS]

export type WorkerDataFn<Data> = {
	[WORKER_STATUS.LOADING] : () => {
		id     : string
		status : WorkerStatusMap['LOADING']
		data   : undefined
	}
	[WORKER_STATUS.ERROR] : ( d: string ) => {
		id     : string
		status : WorkerStatusMap['ERROR']
		error  : string
	}
	[WORKER_STATUS.FINISHED] : ( d: Data ) => {
		id     : string
		status : WorkerStatusMap['FINISHED']
		data   : Data
	}
}
export type WorkerData<Data> = { [key in WorkerStatus]: ReturnType<WorkerDataFn<Data>[key]> }[WorkerStatus]
export const setWorkerData = <Data>( id: string ): WorkerDataFn<Data> => ( {
	[WORKER_STATUS.LOADING] : () => ( {
		id,
		status : WORKER_STATUS.LOADING,
		data   : undefined,
	} ),
	[WORKER_STATUS.ERROR] : d => ( {
		id,
		status : WORKER_STATUS.ERROR,
		error  : d,
	} ),
	[WORKER_STATUS.FINISHED] : d => ( {
		id,
		status : WORKER_STATUS.FINISHED,
		data   : d,
	} ),
} )

export class WorkerInstance<SendData extends { id: string }, HandlerData extends { id: string }> {

	#worker : Worker | undefined
	#input  : () => Promise<{ default: new () => Worker }>
	#listeners = new Set<( e: MessageEvent<HandlerData> ) => void>()

	constructor( input: () => Promise<typeof import( '*?worker' )> ) {

		this.#input = input

	}

	async init() {

		if ( !this.#worker ) this.#worker = new ( await this.#input() ).default()

	}

	setUUID = getUUID

	send( data: SendData ) {

		this.#worker?.postMessage( data )

	}

	sendAndListen( data: Omit<SendData, 'id'>, callback: ( e: MessageEvent<HandlerData> ) => void ) {

		const id = this.setUUID()

		this.#worker?.postMessage( {
			id,
			...data,
		} )

		const ls = this.listen( e => {

			if ( e.data.id !== id ) return

			callback( e )
			ls.unlisten()

		} )

	}

	listen( callback: ( e: MessageEvent<HandlerData> ) => void ) {

		if ( !this.#worker ) throw new Error( 'Worker not initialized' )

		this.#listeners.add( callback )
		this.#worker.addEventListener( 'message', callback )

		return { unlisten: () => this.#unlisten( callback ) }

	}

	#unlisten( callback: ( e: MessageEvent<HandlerData> ) => void ) {

		if ( !this.#worker ) return
		this.#listeners.delete( callback )
		this.#worker.removeEventListener( 'message', callback )

	}

	clear() {

		if ( !this.#worker ) return
		for ( const cb of this.#listeners )
			this.#worker.removeEventListener( 'message', cb )

		this.#listeners.clear()

	}

	destroy() {

		this.clear()
		this.#worker?.terminate()
		this.#worker = undefined

	}

}
