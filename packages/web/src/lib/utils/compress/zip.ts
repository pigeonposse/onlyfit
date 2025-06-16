import { LazyLoader } from '$utils/_super/loader'

export type ZipOptions = { compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 }

const loader = new LazyLoader( { fflate: () => import( 'fflate' ) } )

export const optimizeZip = async (
	file: File,
	opts?: ZipOptions,
): Promise<File> => {

	const fflate       = await loader.get( 'fflate' )
	const arrayBuffer  = await file.arrayBuffer()
	const decompressed = await new Promise<Record<string, Uint8Array>>( ( resolve, reject ) => {

		fflate.unzip( new Uint8Array( arrayBuffer ), ( err, data ) => {

			if ( err ) reject( err )
			else resolve( data )

		} )

	} )

	const compressionLevel = opts?.compressionLevel ?? 6
	const compressed       = await new Promise<Uint8Array>( ( resolve, reject ) => {

		fflate.zip( decompressed, { level: compressionLevel }, ( err, data ) => {

			if ( err ) reject( err )
			else resolve( data )

		} )

	} )

	return new File( [ compressed ], file.name, {
		type         : 'application/zip',
		lastModified : Date.now(),
	} )

}
