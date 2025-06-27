
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

let worker: Worker,
	workerInitPromise

const workerFile              = await import( './worker?worker' )
const postMessageWithResponse = ( worker: Worker, message ) => {

	const workerMessage = new Promise( ( resolve, reject ) => {

		const handleMessage = e => {

			if ( e.data.id !== message.id ) return

			if ( e.data.type === 'initialized' ) resolve()
			else resolve( e.data.result )

			worker.removeEventListener( 'message', handleMessage )
			worker.removeEventListener( 'error', handleError )

		}

		const handleError = err => {

			worker.removeEventListener( 'message', handleMessage )
			worker.removeEventListener( 'error', handleError )
			reject( err )

		}

		worker.addEventListener( 'message', handleMessage )
		worker.addEventListener( 'error', handleError )

		worker.postMessage( message )

	} )

	return workerMessage

}

const getWorker = async () => {

	if ( !worker ) worker = new ( workerFile ).default()

	if ( !workerInitPromise ) {

		workerInitPromise = ( async () => {

			const uuid = crypto.randomUUID()
			await postMessageWithResponse( worker, {
				id   : uuid,
				type : 'init',
			} )
			return worker

		} )()

	}

	await workerInitPromise
	return worker

}

export const workerMode = async () => {

	const w = await getWorker()

	const compress = async ( data, options ) => {

		const taskId = crypto.randomUUID()
		console.log( `Pre Worker ${taskId} [type=compress]`, new Date().toLocaleTimeString() )
		return await postMessageWithResponse( w, {
			id   : taskId,
			type : 'compress',
			data,
			options,
		} )

	}

	const decode = async ( data, options ) => {

		const taskId = crypto.randomUUID()
		return await postMessageWithResponse( w, {
			id   : taskId,
			type : 'decode',
			data,
			options,
		} )

	}

	return {
		compress,
		decode,
	}

}
