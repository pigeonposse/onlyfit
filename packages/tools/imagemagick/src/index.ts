import {
	initializeImageMagick,
	ImageMagick,
	MagickFormat,
} from '@imagemagick/magick-wasm'

export * from '@imagemagick/magick-wasm'

export { initializeImageMagick }
import {
	createCoreInitializer,
	type InitCoreOptions,
} from '../../_shared/wasm'

export type { InitCoreOptions }

/**
 * Runs the ImageMagick WASM library
 */
export const init = createCoreInitializer( {
	libraryName : '@imagemagick/magick-wasm',
	path        : 'dist/magick.wasm',
	fn          : initializeImageMagick,
	compile     : false,
} )

export type OptimizeImageOptions = {
	width?   : number
	height?  : number
	/**
	 * @default 75
	 */
	quality? : number
	/**
	 * @default MagickFormat.Jpeg
	 */
	format?  : MagickFormat
}

export const convert = async ( input: ArrayBuffer, format : MagickFormat ): Promise<ArrayBuffer> =>
	await new Promise( ( resolve, reject ) => {

		const buffer = new Uint8Array( input )
		// @ts-ignore
		ImageMagick.read( buffer, image => {

			// @ts-ignore
			image.write( format, output => resolve( output ) )

		}, reject )

	} )

export const optimize = async (
	input: ArrayBuffer,
	opts?: OptimizeImageOptions,
): Promise<ArrayBuffer> => {

	const {
		width,
		height,
		quality = 75,
		format = MagickFormat.Jpeg,
	} = opts || {}

	return await new Promise( ( resolve, reject ) => {

		const buffer = new Uint8Array( input )

		// @ts-ignore
		ImageMagick.read( buffer, image => {

			if ( width || height ) image.resize( width ?? 0, height ?? 0 )
			image.quality = quality
			// @ts-ignore
			image.write( format, output => {

				resolve( output )

			} )

		}, reject )

	} )

}
