import decode from '@jsquash/jxl/decode'
import encode from '@jsquash/jxl/encode'

import type { EncodeOptions } from '@jsquash/jxl'

export {
	decode,
	encode,
}
export * from './init'
export type CompressOptions = Partial<EncodeOptions>

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
