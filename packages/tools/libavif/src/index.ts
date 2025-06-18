
import decode from '@jsquash/avif/decode'
import encode from '@jsquash/avif/encode'

export {
	decode,
	encode,
}
export * from './init'

export type CompressOptions = Parameters<typeof encode>[1]
export const compress = async (
	input: ArrayBuffer,
	opts?: CompressOptions,
): Promise<ArrayBuffer> => {

	const decodeInput = await decode( input )

	if ( !decodeInput ) throw new Error( 'Failed to decode input' )

	// @ts-ignore
	const bytes = await encode( decodeInput, {
		quality : 60,
		...opts || {},
	} )

	return bytes

}
