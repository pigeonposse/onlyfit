import decode, { init as initDecode } from '@jsquash/jxl/decode'
import encode, { init as initEncode } from '@jsquash/jxl/encode'

import type { EncodeOptions } from '@jsquash/jxl'

export {
	decode,
	encode,
	initDecode,
	initEncode,
}

export type CompressOptions = EncodeOptions

export const compress = async (
	input: ArrayBuffer,
	opts?: CompressOptions,
): Promise<ArrayBuffer> => {

	const decodeInput = await decode( input )

	const jxlBytes = await encode( decodeInput, {
		quality : 60,
		...opts,
	} )

	return jxlBytes

}
