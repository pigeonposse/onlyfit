import { init as initDecode } from '@jsquash/qoi/decode'
import { init as initEncode } from '@jsquash/qoi/encode'

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
	libraryName : '@jsquash/qoi',
	decode      : {
		fn   : initDecode,
		path : 'codec/enc/qoi_enc.wasm',
	},
	encode : {
		fn   : initEncode,
		path : 'codec/dec/qoi_dec.wasm',
	},
} )

