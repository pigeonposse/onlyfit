
import {
	ensureDir,
	getCurrentDir,
	joinPath,
	readFile,
	writeFile,
} from '@dovenv/core/utils'
// import { mime }      from '@onlyfit/core'
import { DATA_PATH } from '@onlyfit/repo-config/data'

import {
	optimize,
	convert,
	init,
	// Magick,
	// MagickFormat
} from '.'

const input    = DATA_PATH['jpg']
const pkgDir   = joinPath( getCurrentDir( import.meta.url ), '..' )
const buildDir = joinPath( pkgDir, 'build' )
const wasmDir  = joinPath( pkgDir, './node_modules/@imagemagick/magick-wasm/dist/magick.wasm' )

await init( await readFile( wasmDir ) )

// console.log( Object.values( MagickFormat ).map( f => mime.getType( f ) ).filter( f => typeof f === 'string' ).length )
// console.log(Magick.supportedFormats.length)
// process.exit()
// mime.getType

await ensureDir( buildDir )

const inputBuffer = await readFile( input )
const minified    = await optimize( inputBuffer, { format: 'AI' } )
await writeFile( joinPath( buildDir, 'compressed.ai' ), Buffer.from( minified ) )
console.log( {
	input       : inputBuffer.byteLength,
	minified    : minified.byteLength,
	isOptimized : minified.byteLength < inputBuffer.byteLength,
} )

const minified2 = await convert( inputBuffer, 'BMP' )
await writeFile( joinPath( buildDir, 'compressed.bmp' ), Buffer.from( minified2 ) )
console.log( { converter : {
	input       : inputBuffer.byteLength,
	minified    : minified2.byteLength,
	isOptimized : minified2.byteLength < inputBuffer.byteLength,
} } )
