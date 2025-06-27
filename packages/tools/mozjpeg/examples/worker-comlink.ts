import * as Comlink from 'https://unpkg.com/comlink/dist/esm/comlink.mjs'

import {
	init,
	compress,
	decode,
} from '../src/index'

await init( {
	encode : async ( { fetchFromCDNs } ) => await fetchFromCDNs(),
	decode : async ( { fetchFromCDNs } ) => await fetchFromCDNs(),
} )

Comlink.expose( {
	init,
	compress,
	decode,
} )
