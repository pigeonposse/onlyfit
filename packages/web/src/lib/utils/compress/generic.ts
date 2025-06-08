export type GenericOptions = { rename?: boolean }

export const optimizeGeneric = async ( file: File, opts?: GenericOptions ): Promise<File> => {

	try {

		// Convert File to ArrayBuffer
		const arrayBuffer = await file.arrayBuffer()

		// GZIP compression using CompressionStream (native in modern browsers)
		const gzipStream       = new CompressionStream( 'gzip' )
		const compressedStream = new Blob( [ arrayBuffer ] ).stream().pipeThrough( gzipStream )
		const compressedBuffer = await new Response( compressedStream ).arrayBuffer()

		// Rename file if needed
		const newName = opts?.rename
			? file.name.replace( /\.[^/.]+$/, '' ) + '.gz'
			: file.name

		// Create new File from compressed buffer
		return new File( [ compressedBuffer ], newName, {
			type         : 'application/gzip',
			lastModified : Date.now(),
		} )

	}
	catch ( err ) {

		console.error( `Generic compression failed for ${file.name}:`, ( err as Error ).message )
		return file // fallback: return original file

	}

}
