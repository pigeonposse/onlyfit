import { init as initDecode } from '@jsquash/jpeg/decode'
import { init as initEncode } from '@jsquash/jpeg/encode'

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
	libraryName : '@jsquash/jpeg',
	decode      : {
		fn   : initDecode,
		path : 'codec/dec/mozjpeg_dec.wasm',
	},
	encode : {
		fn   : initEncode,
		path : 'codec/enc/mozjpeg_enc.wasm',
	},
} )

