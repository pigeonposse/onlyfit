import { setWorkerData } from './_shared'

import type {
	ReceivedData,
	SendData,
} from './mimetype.types'

self.onmessage = async ( event: MessageEvent<SendData> ) => {

	const type = event.data?.type
	const id   = event.data?.id
	if ( !type || !id ) return

	const data = setWorkerData<ReceivedData>( id )
	try {

		const res = await fetch( `/mimetypes/${type}` )
		if ( !res.ok ) throw new Error( `Failed to fetch mime info for "${type}"` )

		const text = await res.text()

		self.postMessage( data['FINISHED']( text ) )

	}
	catch ( err ) {

		console.warn( 'Error in worker while fetching mime info', err )
		self.postMessage(
			data['ERROR']( err instanceof Error ? err.message : 'Unexpected error' ),
		)

	}

}
