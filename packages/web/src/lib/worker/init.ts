import { setWorkerData } from './_shared'

import type {
	ReceivedData,
	SendData,
} from './init.types'

import { onlyfit } from '$core/onlyfit'

// if ( 'caches' in self ) console.log( 'caches API not supported in service workers' )

self.onmessage = async ( event: MessageEvent<SendData> ) => {

	const type = event.data?.type
	const id   = event.data?.id
	if ( !type || !id ) return

	const data = setWorkerData<ReceivedData>( id )
	try {

		const plugin = onlyfit.plugin.get( type )
		await plugin?.data.init?.()

		self.postMessage( data['FINISHED']( true ) )

	}
	catch ( err ) {

		self.postMessage(
			data['ERROR']( err instanceof Error ? err.message : 'Unexpected error' ),
		)

	}

}
