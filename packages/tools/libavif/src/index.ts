
import decode, { init as initDecode } from '@jsquash/avif/decode'
import encode, { init as initEncode } from '@jsquash/avif/encode'

export {
	decode,
	encode,
	initDecode,
	initEncode,
}
export type CompressOptions = Parameters<typeof encode>[1]
export const compress = async (
	input: ArrayBuffer,
	opts?: CompressOptions,
): Promise<ArrayBuffer> => {

	const decodeInput = await decode( input )

	if ( !decodeInput ) throw new Error( 'Failed to decode input' )

	const jxlBytes = await encode( decodeInput, {
		quality : 60,
		...opts,
	} )

	return jxlBytes

}
