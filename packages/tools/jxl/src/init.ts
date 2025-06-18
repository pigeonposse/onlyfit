import { init as initDecode } from '@jsquash/jxl/decode'
import { init as initEncode } from '@jsquash/jxl/encode'

import {
	createInitializer,
	type InitOptions,
} from '../../_shared/wasm'

export {
	initDecode,
	initEncode,
	InitOptions,
}

const paths = {
	encode : 'codec/enc/jxl_enc.wasm',
	decode : 'codec/dec/jxl_dec.wasm',
}

export const init =  createInitializer( {
	libraryName : '@jsquash/jxl',
	decode      : {
		fn   : initDecode,
		path : paths.decode,
	},
	encode : {
		fn   : initEncode,
		path : paths.encode,
	},
} )

