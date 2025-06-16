
import decode, { init as initDecode } from '@jsquash/qoi/decode'
import encode, { init as initEncode } from '@jsquash/qoi/encode'

import {
	optimizeImageData,
	OptimizeImageOptions,
} from './core'

export {
	decode,
	encode,
	initDecode,
	initEncode,
}
export type CompressOptions = OptimizeImageOptions
export const compress = async (
	input: ArrayBuffer,
	opts?: CompressOptions,
): Promise<ArrayBuffer> => {

	const decodeInput = await decode( input )
	const optimize    = optimizeImageData( decodeInput, opts )
	if ( !decodeInput ) throw new Error( 'Failed to decode input' )

	const jxlBytes = await encode( optimize )

	return jxlBytes

}
