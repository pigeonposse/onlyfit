import { setWorkerData } from './_shared'

import type {
	SendData,
	ReceivedData,
} from './optimize.types'

import { onlyfit } from '$core/onlyfit'

self.onmessage = async ( event: MessageEvent<SendData> ) => {

	if ( !event.data || !event.data?.type || !event.data?.id ) return

	const data = setWorkerData<ReceivedData>( event.data.id )
	try {

		const plugin = onlyfit.filter.find( {
			from : event.data.type,
			type : 'optimizer',
		} )

		const buffer = await plugin?.value.optimizer?.fn( {
			input   : event.data.buffer,
			type    : event.data.type,
			options : event.data.options,
		} )

		if ( !buffer ) throw new Error( `Failed to optimize "${event.data.type}"` )

		self.postMessage( data['FINISHED']( {
			buffer,
			type : event.data.type,
		} ) )

	}
	catch ( err ) {

		self.postMessage(
			data['ERROR']( err instanceof Error ? err.message : 'Unexpected error' ),
		)

	}

}
