/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

let worker: Worker,
	workerInitPromise

const pendingMap = new Map()

const getWorker = async () => {

	if ( !worker ) worker = new ( await import( './worker?worker' ) ).default()

	worker.addEventListener( 'message', e => {

		const {
			id, type, result,
		} = e.data
		const entry = pendingMap.get( id )

		if ( entry ) {

			if ( type === 'initialized' ) {

				entry.resolve()

			}
			else {

				entry.resolve( result )

			}
			pendingMap.delete( id )

		}

	} )

	worker.addEventListener( 'error', err => {

		for ( const [ id, { reject } ] of pendingMap.entries() ) {

			reject( err )

		}
		pendingMap.clear()

	} )

	return worker

}

export const workerMode = async () => {

	if ( !workerInitPromise ) {

		workerInitPromise = ( async () => {

			const worker = await getWorker()
			const uuid   = crypto.randomUUID()

			await new Promise( ( resolve, reject ) => {

				pendingMap.set( uuid, {
					resolve,
					reject,
				} )
				worker.postMessage( {
					id   : uuid,
					type : 'init',
				} )

			} )

			return worker

		} )()

	}

	const worker = await workerInitPromise

	const compress = async ( data, options ) => {

		const taskId = crypto.randomUUID()
		return new Promise( ( resolve, reject ) => {

			pendingMap.set( taskId, {
				resolve,
				reject,
			} )
			worker.postMessage( {
				id   : taskId,
				type : 'compress',
				data,
				options,
			} )

		} )

	}

	const decode = async ( data, options ) => {

		const taskId = crypto.randomUUID()
		return new Promise( ( resolve, reject ) => {

			pendingMap.set( taskId, {
				resolve,
				reject,
			} )
			worker.postMessage( {
				id   : taskId,
				type : 'decode',
				data,
				options,
			} )

		} )

	}

	return {
		compress,
		decode,
	}

}
