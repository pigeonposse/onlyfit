import { defineConfig } from './src/index'
import cleancss         from '../tools/clean-css/src/plugin'
import csso             from '../tools/csso/src/plugin'
import ffmpeg           from '../tools/ffmpeg/src/plugin'
import fonteditor       from '../tools/fonteditor/src/plugin'
import ghostscript      from '../tools/ghostscript/src/plugin'

export default defineConfig( { plugin : {
	cleancss    : cleancss(),
	csso        : csso(),
	fonteditor  : fonteditor( { woff2Wasm: async ( { fetchFromUNPKG } ) => fetchFromUNPKG() } ),
	ghostscript : ghostscript(),
	...ffmpeg(),
} } )
