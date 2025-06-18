import { init as initDecode } from '@jsquash/webp/decode'
import { init as initEncode } from '@jsquash/webp/encode'

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
	libraryName : '@jsquash/webp',
	decode      : {
		fn   : initDecode,
		path : 'codec/enc/webp_enc.wasm',
	},
	encode : {
		fn   : initEncode,
		path : 'codec/dec/webp_dec.wasm',
	},
} )

