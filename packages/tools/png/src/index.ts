
import decode, { init as init } from '@jsquash/png/decode'
import encode                   from '@jsquash/png/encode'

export {
	decode,
	encode,
	init,
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
