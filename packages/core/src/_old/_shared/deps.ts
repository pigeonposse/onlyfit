import { LazyLoader } from './loader'

const isBrowser: boolean = typeof window !== 'undefined' && typeof window.document !== 'undefined'
import type { initDecode } from '@onlyfit/jxl'

export const deps = new LazyLoader( {
	// HTML
	htmlMinimifierTerser : async () => {

		return !isBrowser
			? import( '@onlyfit/html-minifier-terser' )
			: await import( '@onlyfit/html-minifier-terser/browser' )

	},
	// CSS
	csso     : () => import( '@onlyfit/csso' ),
	cleancss : async () => {

		return !isBrowser
			? import( '@onlyfit/clean-css' )
			: await import( '@onlyfit/clean-css/browser' )

	},
	lightningcss : () => import( '@onlyfit/lightningcss' ),
	// PDF
	pdfLib       : () => import( '@onlyfit/pdf-lib' ) as Promise<typeof import( '@onlyfit/pdf-lib' )>,
	ghostscript  : async () => {

		return !isBrowser
			? await import( '@onlyfit/ghostscript' )
			: await import( '@onlyfit/ghostscript/browser' )

	},
	// docs (excel, shets, etc...)
	xlsx        : () => import( '@onlyfit/xlsx' ) as Promise<typeof import( '@onlyfit/xlsx' )>,
	// IMAGE
	jxl         : () => import( '@onlyfit/jxl' ),
	libavif     : () => import( '@onlyfit/libavif' ),
	libwebp     : () => import( '@onlyfit/libwebp' ),
	mozjpeg     : () => import( '@onlyfit/mozjpeg' ),
	oxipng      : () => import( '@onlyfit/oxipng' ),
	png         : () => import( '@onlyfit/png' ),
	qoi         : () => import( '@onlyfit/qoi' ),
	resize      : () => import( '@onlyfit/resize' ),
	imagemagick : () => import( '@onlyfit/imagemagick' ),
	utif        : () => import( '@onlyfit/utif' ) as Promise<typeof import( '@onlyfit/utif' )>,
	// svg
	svgo        : () => import( '@onlyfit/svgo' ),
	// GIF
	gifski      : () => import( '@onlyfit/gifski' ),
	// AUIDO & VIDEO
	ffmpeg      : () => import( '@onlyfit/ffmpeg' ),
	lamejs      : () => import( '@onlyfit/lamejs' ),
	// FONT
	fonteditor  : () => import( '@onlyfit/fonteditor' ) as Promise<typeof import( '@onlyfit/fonteditor' )>,
} )

type InitOptions = Parameters<typeof initDecode>
type ImageInitOptions = {
	decode : InitOptions
	encode : InitOptions
}

export const init = {
	ghostscript : async ( path: string ) => ( await deps.get( 'ghostscript' ) ).init( path ),
	jxl         : async ( opts: ImageInitOptions ) => {

		const lib = await deps.get( 'jxl' )
		await lib.initDecode( opts.decode )
		await lib.initEncode( opts.encode )

	},
	libwebp : async ( opts: ImageInitOptions ) => {

		const lib = await deps.get( 'libwebp' )
		await lib.initDecode( opts.decode )
		await lib.initEncode( opts.encode )

	},
	libavif : async ( opts: ImageInitOptions ) => {

		const lib = await deps.get( 'libavif' )
		await lib.initDecode( opts.decode )
		await lib.initEncode( opts.encode )

	},
	mozjpeg : async ( opts: ImageInitOptions ) => {

		const lib = await deps.get( 'mozjpeg' )
		await lib.initDecode( opts.decode )
		await lib.initEncode( opts.encode )

	},
}

