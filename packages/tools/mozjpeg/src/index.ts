
import decode from '@jsquash/jpeg/decode'
import encode from '@jsquash/jpeg/encode'

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
	const options = {
		quality : 60,
		...opts,
	}

	const bytes = await encode( decodeInput, options )
	return bytes

}
