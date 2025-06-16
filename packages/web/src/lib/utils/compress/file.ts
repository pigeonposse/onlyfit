import {
	optimizeAudio,
	type AudioOptions,
} from './audio'
import {
	optimizeCss,
	type CSSOptions,
} from './css'
import {
	optimizeGeneric,
	type GenericOptions,
} from './generic'
import {
	optimizeHtml,
	type HtmlOptions,
} from './html'
import {
	optimizeGif,
	optimizeImage,
	type GifOptions,
	type ImageOptions,
} from './image'
import {
	optimizePDF,
	type PDFOptions,
} from './pdf'
import {
	optimizeSVG,
	type SvgOptions,
} from './svg'
import {
	optimizeVideo,
	type VideoOptions,
} from './video'
import {
	optimizeZip,
	type ZipOptions,
} from './zip'

export type OptimizeOptions = {
	pdf?     : PDFOptions
	image?   : ImageOptions
	svg?     : SvgOptions
	gif?     : GifOptions
	zip?     : ZipOptions
	video?   : VideoOptions
	audio?   : AudioOptions
	generic? : GenericOptions
	html?    : HtmlOptions
	css?     : CSSOptions
}

const imageFormats = new Set( [
	'jpg',
	'jpeg',
	'png',
	'avif',
	'webp',
	'bmp',
	'heic',
	'tiff',
] )

export class OptimizeFile {

	static pdf   = optimizePDF
	static image = optimizeImage
	static svg   = optimizeSVG
	static generic = optimizeGeneric
	static gif = optimizeGif
	static zip = optimizeZip
	static video = optimizeVideo
	static audio = optimizeAudio
	static html = optimizeHtml
	static css = optimizeCss

	static async run( file: File, opts?: OptimizeOptions ): Promise<File> {

		const nameParts = file.name.split( '.' )
		const ext       = nameParts.pop()?.toLowerCase()

		if ( !ext ) throw new Error( 'File extension not found' )

		if ( file.type === 'image/svg+xml' || ext === 'svg' )
			return await OptimizeFile.svg( file, opts?.svg )
		if ( file.type === 'image/gif' || ext === 'gif' )
			return await OptimizeFile.gif( file, opts?.gif )
		if ( file.type.startsWith( 'image/' ) || imageFormats.has( ext ) )
			return await OptimizeFile.image( file, opts?.image )
		if ( file.type === 'application/pdf' || ext === 'pdf' )
			return await OptimizeFile.pdf( file, opts?.pdf )
		if ( file.type === 'application/zip' )
			return await OptimizeFile.zip( file, opts?.zip )
		if ( file.type.startsWith( 'video/' ) )
			return await OptimizeFile.video( file, opts?.zip )
		if ( file.type.startsWith( 'audio/' ) )
			return await OptimizeFile.audio( file, opts?.zip )
		if ( file.type === 'text/html' )
			return await OptimizeFile.html( file, opts?.html )
		if ( file.type === 'text/css' )
			return await OptimizeFile.css( file, opts?.css )
		return file

	}

}
