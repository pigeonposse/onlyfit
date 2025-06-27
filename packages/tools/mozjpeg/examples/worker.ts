import {
	init,
	compress,
	decode,
} from '../src/index'

let initialized = false
// console.log( 'Worker is initialized', initialized )

self.addEventListener( 'message', async e => {

	const {
		id, type, data, options,
	} = e.data

	console.log( `Starting Worker ${id} [type=${type}]`, new Date().toLocaleTimeString() )

	try {

		if ( type === 'init' ) {

			if ( !initialized ) {

				await init( {
					encode : async ( { fetchFromCDNs } ) => await fetchFromCDNs(),
					decode : async ( { fetchFromCDNs } ) => await fetchFromCDNs(),
				} )

				initialized = true

			}
			self.postMessage( {
				type : 'initialized',
				id,
			} )

		}
		if ( !initialized ) throw new Error( 'Worker not initialized' )

		if ( type === 'compress' ) {

			const result = await compress( data, options )
			console.log( 'compressed' )
			self.postMessage( {
				id,
				type : 'compressed',
				result,
			} )

		}
		else if ( type === 'decode' ) {

			const result = await decode( data, options )
			self.postMessage( {
				id,
				type : 'decoded',
				result,
			} )

		}
		console.log( `Ended Worker ${id} [type=${type}]`, new Date().toLocaleTimeString() )

	}
	catch ( err ) {

		// console.log( err )
		self.postMessage( {
			id,
			type  : 'error',
			error : err,
		} )

	}

} )
