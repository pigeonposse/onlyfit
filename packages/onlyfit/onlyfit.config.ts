import {
	joinPath,
	getCurrentDir,
	readFile,
} from '@dovenv/core/utils'

import { defineConfig }   from './src/index'
import cleancss           from '../tools/clean-css/src/plugin'
import csso               from '../tools/csso/src/plugin'
import ffmpeg             from '../tools/ffmpeg/src/plugin'
import fonteditor         from '../tools/fonteditor/src/plugin'
import ghostscript        from '../tools/ghostscript/src/plugin'
import gifski             from '../tools/gifski/src/plugin'
import htmlMinifierTerser from '../tools/html-minifier-terser/src/plugin'
import imagemagick        from '../tools/imagemagick/src/plugin'
import jxl                from '../tools/jxl/src/plugin'
import lamejs             from '../tools/lamejs/src/plugin'
import libavif            from '../tools/libavif/src/plugin'
import libwebp            from '../tools/libwebp/src/plugin'
import lightningcss       from '../tools/lightningcss/src/plugin'
import mozjpeg            from '../tools/mozjpeg/src/plugin'
import oxipng             from '../tools/oxipng/src/plugin'
import pdfLib             from '../tools/pdf-lib/src/plugin'
import png                from '../tools/png/src/plugin'
import qoi                from '../tools/qoi/src/plugin'
// import resize             from '../tools/resize/src/plugin'
import svgo from '../tools/svgo/src/plugin'
import utif from '../tools/utif/src/plugin'
import xlsx from '../tools/xlsx/src/plugin'

const pkgDir   = getCurrentDir( import.meta.url )
const toolsDir = joinPath( pkgDir, '../tools' )
// const imagemagickWasm = joinPath( toolsDir, 'imagemagick', 'node_modules/@imagemagick/magick-wasm/dist/magick.wasm' )
const lcssWas = joinPath( toolsDir, 'lightningcss', 'node_modules/lightningcss-wasm/lightningcss_node.wasm' )

export default defineConfig( { plugin : {
	'cleancss'             : cleancss(),
	'csso'                 : csso(),
	'lightningcss'         : lightningcss( lcssWas ),
	'html-minifier-terser' : htmlMinifierTerser(),

	'fonteditor'  : fonteditor( { woff2Wasm: async ( { fetchFromUNPKG } ) => fetchFromUNPKG() } ),
	'ghostscript' : ghostscript(),
	'gifski'      : gifski(),
	'jxl'         : jxl( {
		encode : async ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
		decode : async ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
	} ),
	'libwebp' : libwebp( {
		encode : async ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
		decode : async ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
	} ),
	'libavif' : libavif( {
		encode : async ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
		decode : async ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
	} ),
	'mozjpeg' :	mozjpeg( {
		encode : async ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
		decode : async ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
	} ),
	'oxipng' : oxipng(),
	'png'    : png(),
	'qoi'    : qoi( {
		encode : async ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
		decode : async ( { fetchFromJSDelivr } ) => fetchFromJSDelivr(),
	} ),
	'imagemagick' : imagemagick( async ( { wasmURLs } ) => fetchFromJSDelivr() ),

	...ffmpeg(),
	// others
	'utif'    : utif(),
	'xlsx'    : xlsx(),
	'pdf-lib' : pdfLib(),
	'svgo'    : svgo(),
	'lamejs'  : lamejs(),

} } )

