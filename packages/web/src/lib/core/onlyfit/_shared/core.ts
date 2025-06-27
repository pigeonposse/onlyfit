import bic                from '@onlyfit/browser-image-compression/plugin'
import cleancss           from '@onlyfit/clean-css/plugin'
import { Core }           from '@onlyfit/core'
import csso               from '@onlyfit/csso/plugin'
import fflate             from '@onlyfit/fflate/plugin'
import ffmpeg             from '@onlyfit/ffmpeg/plugin'
import fonteditor         from '@onlyfit/fonteditor/plugin'
import ghostscript        from '@onlyfit/ghostscript/plugin'
import gifski             from '@onlyfit/gifski/plugin'
import htmlMinifierTerser from '@onlyfit/html-minifier-terser/plugin'
import imagemagick        from '@onlyfit/imagemagick/plugin'
import jxl                from '@onlyfit/jxl/plugin'
import lamejs             from '@onlyfit/lamejs/plugin'
import libavif            from '@onlyfit/libavif/plugin'
import libwebp            from '@onlyfit/libwebp/plugin'
import lightningcss       from '@onlyfit/lightningcss/plugin'
// import mozjpeg            from '@onlyfit/mozjpeg/plugin'
import oxipng from '@onlyfit/oxipng/plugin'
import pdfLib from '@onlyfit/pdf-lib/plugin'
import png    from '@onlyfit/png/plugin'
import qoi    from '@onlyfit/qoi/plugin'
// import resize             from '../tools/resize/plugin'
// import svgo from '@onlyfit/svgo/plugin'
import utif from '@onlyfit/utif/plugin'
import xlsx from '@onlyfit/xlsx/plugin'

import mozjpeg from '../../../../../../tools/mozjpeg/src/plugin'
import svgo    from '../../../../../../tools/svgo/src/plugin'

import type { ConfigCli } from '../../../../../../onlyfit/src/index'

const config = { plugin : {
	fflate             : fflate(),
	cleancss           : cleancss(),
	csso               : csso(),
	lightningcss       : lightningcss( ),
	htmlMinifierTerser : htmlMinifierTerser(),

	fonteditor  : fonteditor( { woff2Wasm: ( { fetchFromUNPKG } ) => fetchFromUNPKG() } ),
	ghostscript : ghostscript( { wasmInput: 'https://cdn.jsdelivr.net/npm/@jspawn/ghostscript-wasm/gs.wasm' } ),
	gifski      : gifski( { wasmInput: 'https://cdn.jsdelivr.net/npm/gifski-wasm/pkg/gifski_wasm_bg.wasm' } ),
	jxl         : jxl( {
		encode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
		decode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
	} ),
	libwebp : libwebp( {
		encode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
		decode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
	} ),
	libavif : libavif( {
		encode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
		decode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
	} ),
	mozjpeg :	mozjpeg( {
		encode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
		decode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
	} ),
	oxipng : oxipng(),
	png    : png(),
	qoi    : qoi( {
		encode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
		decode : ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
	} ),
	// others
	utif                    : utif(),
	xlsx                    : xlsx(),
	pdfLib                  : pdfLib(),
	svgo                    : svgo(),
	lamejs                  : lamejs(),
	browserImageCompression : bic(),
	gzip                    : async utils => ( { optimizer : {
		mimetypes : [
			utils.mime.getType( 'gzip' ),
			utils.mime.getType( 'zip' ),
			'application/zlib',
			'application/x-deflate',
		].filter( f => typeof f === 'string' ),
		fn : async ( {
			input, type,
		} ) => {

			const compressiontype  = type === 'application/zlib'
				? 'deflate'
				: type === 'application/x-deflate'
					? 'deflate-raw'
					: 'gzip'
			const gzipStream       = new CompressionStream( compressiontype )
			const compressedStream = new Blob( [ input ] ).stream().pipeThrough( gzipStream )
			const compressedBuffer = await new Response( compressedStream ).arrayBuffer()

			return compressedBuffer

		},
	} } ),
	imagemagick : imagemagick( ( { fetchFromJSDelivr } ) => fetchFromJSDelivr() ),

	...ffmpeg(),
} } satisfies ConfigCli

// @ts-ignore
const _core = new Core( config )
const {
	init:_,
	plugins:__,
	...rest
} = _core

const coreInstance = await _core.init()

export const core = {
	...coreInstance,
	...rest,
}
