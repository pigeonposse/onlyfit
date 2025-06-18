import { init as initDecode } from '@jsquash/avif/decode'
import { init as initEncode } from '@jsquash/avif/encode'

import {
	createInitializer,
	type InitOptions,
} from '../../_shared/wasm'

export {
	initDecode,
	initEncode,
	InitOptions,
}

export const init =  createInitializer( {
	libraryName : '@jsquash/avif',
	decode      : {
		fn   : initDecode,
		path : 'codec/dec/avif_dec.wasm',
	},
	encode : {
		fn   : initEncode,
		path : 'codec/enc/avif_enc.wasm',
	},
} )

