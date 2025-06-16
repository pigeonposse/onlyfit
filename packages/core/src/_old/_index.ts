import { init }   from './_shared/deps'
import {
	AudioConvert,
	AudioOptimize,
} from './audio'
import {
	CssConvert,
	CssOptimize,
}     from './css'
import {
	DocsConvert,
	DocsOptimize,
}   from './docs'
import {
	FontConvert,
	FontOptimize,
} from './font'
import {
	HtmlConvert,
	HtmlOptimize,
} from './html'
import {
	ImageConvert,
	ImageOptimize,
} from './image'
import {
	PdfConvert,
	PdfOptimize,
}     from './pdf'
import {
	SvgConvert,
	SvgOptimize,
} from './svg'
import { VideoOptimize } from './video'

// "@onlyfit/clean-css": "workspace:*",
// "@onlyfit/csso": "workspace:*",
// "@onlyfit/ffmpeg": "workspace:*",
// "@onlyfit/fonteditor": "workspace:*",
// "@onlyfit/ghostscript": "workspace:*",
// "@onlyfit/gifski": "workspace:*",
// "@onlyfit/html-minifier-terser": "workspace:*",
// "@onlyfit/imagemagick": "workspace:*",
// "@onlyfit/jxl": "workspace:*",
// "@onlyfit/lamejs": "workspace:*",
// "@onlyfit/libavif": "workspace:*",
// "@onlyfit/libwebp": "workspace:*",
// "@onlyfit/lightningcss": "workspace:*",
// "@onlyfit/mozjpeg": "workspace:*",
// "@onlyfit/oxipng": "workspace:*",
// "@onlyfit/pdf-lib": "workspace:*",
// "@onlyfit/png": "workspace:*",
// "@onlyfit/qoi": "workspace:*",
// "@onlyfit/resize": "workspace:*",
// "@onlyfit/svgo": "workspace:*",
// "@onlyfit/utif": "workspace:*",
// "@onlyfit/xlsx": "workspace:*",

export { init }

export class Optimizer {

	html
	audio
	css
	docs
	font
	image
	pdf
	svg
	video

	constructor( input: ArrayBuffer ) {

		this.html  = new HtmlOptimize( input )
		this.css   = new CssOptimize( input )
		this.pdf   = new PdfOptimize( input )
		this.audio = new AudioOptimize( input )
		this.font  = new FontOptimize( input )
		this.image = new ImageOptimize( input )
		this.svg   = new SvgOptimize( input )
		this.video = new VideoOptimize( input )
		this.docs  = new DocsOptimize( input )

	}

}

export class Converter {

	html
	audio
	css
	docs
	font
	image
	pdf
	svg
	video

	constructor( input: ArrayBuffer ) {

		this.html  = new HtmlConvert( input )
		this.audio = new AudioConvert( input )
		this.css   = new CssConvert( input )
		this.image = new ImageConvert( input )
		this.svg   = new SvgConvert( input )
		this.video = new VideoOptimize( input )
		this.docs  = new DocsConvert( input )
		this.font  = new FontConvert( input )
		this.pdf   = new PdfConvert( input )

	}

}
