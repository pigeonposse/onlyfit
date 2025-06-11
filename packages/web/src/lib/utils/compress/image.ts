import type { Options } from 'browser-image-compression'

import { LazyLoader } from '$utils/_super/loader'

export type ImageOptions = Options & { rename?: boolean }

export type GifOptions = { rename?: boolean }

const loader = new LazyLoader( { imageCompression: async () => ( ( await import( 'browser-image-compression' ) ).default ) } )

export const optimizeImage = async (
	file: File,
	opts?: ImageOptions,
): Promise<File> => {

	if ( !file.type.startsWith( 'image/' ) || file.type === 'image/gif' )
		throw new Error( 'Only non-GIF image types are supported in compressImage' )

	const imageCompression = await loader.get( 'imageCompression' )
	const compressedBlob   = await imageCompression( file, {
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
