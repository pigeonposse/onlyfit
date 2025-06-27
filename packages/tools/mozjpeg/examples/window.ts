/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
let windowInitialized = false,
	windowInitPromise = null

const {
	compress, init, decode,
} = await import( '../src/index' )

export const windowMode = async () => {

	if ( !windowInitialized ) {

		if ( !windowInitPromise ) {

			windowInitPromise = init( {
				encode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
				decode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
			} ).then( () => {

				windowInitialized = true
				return

			} )

		}
		await windowInitPromise

	}
	// await init( {
	// 	encode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
	// 	decode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
	// } )
	return {
		compress,
		decode,
	}

}
