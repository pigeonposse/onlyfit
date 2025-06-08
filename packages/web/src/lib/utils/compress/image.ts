import imageCompression from 'browser-image-compression'

export type ImageOptions = Parameters<typeof imageCompression>[1] & { rename?: boolean }

export type GifOptions = { rename?: boolean }

export const optimizeImage = async (
	file: File,
	opts?: ImageOptions,
): Promise<File> => {

	if ( !file.type.startsWith( 'image/' ) || file.type === 'image/gif' )
		throw new Error( 'Only non-GIF image types are supported in compressImage' )

	const compressedBlob = await imageCompression( file, {
		useWebWorker : true,
		...( opts || {} ),
	} )

	return new File(
		[ compressedBlob ],
		opts?.rename ? `optimized-${file.name}` : file.name,
		{ type: compressedBlob.type },
	)

}

export const optimizeGif = async (
	file: File,
	opts?: GifOptions,
): Promise<File> => {

	if ( file.type !== 'image/gif' )
		throw new Error( 'Only GIF files are supported in compressGif' )

	// Here we simply return the original file or renamed copy.
	return new File(
		[ file ],
		opts?.rename ? `optimized-${file.name}` : file.name,
		{ type: file.type },
	)

}
