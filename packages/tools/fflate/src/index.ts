import {
	type AsyncZipOptions,
	unzip,
	zip,
} from 'fflate'

export * from 'fflate'

type CompressOptions = AsyncZipOptions
export const compress = async ( input: ArrayBuffer, opts?: CompressOptions ): Promise<ArrayBuffer> => {

	const decompressed = await new Promise<Record<string, Uint8Array>>( ( resolve, reject ) => {

		unzip( new Uint8Array( input ), ( err, data ) => {

			if ( err ) reject( err )
			else resolve( data )

		} )

	} )

	const compressionLevel = opts?.level ?? 6
	const compressed       = await new Promise<Uint8Array>( ( resolve, reject ) => {

		zip( decompressed, { level: compressionLevel }, ( err, data ) => {

			if ( err ) reject( err )
			else resolve( data )

		} )

	} )

	return compressed.buffer

}
