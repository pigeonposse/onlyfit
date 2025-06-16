
import {
	ensureDir,
	getCurrentDir,
	joinPath,
	readFile,
	writeFile,
} from '@dovenv/core/utils'
import { DATA_PATH } from '@onlyfit/repo-config/data'

import {
	optimize,
	convert,
	init,
} from '.'

const input    = DATA_PATH['jpg']
const pkgDir   = joinPath( getCurrentDir( import.meta.url ), '..' )
const buildDir = joinPath( pkgDir, 'build' )
const wasmDir  = joinPath( pkgDir, './node_modules/@imagemagick/magick-wasm/dist/magick.wasm' )

await init( await readFile( wasmDir ) )
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
console.log( {
	input       : inputBuffer.byteLength,
	minified    : minified2.byteLength,
	isOptimized : minified2.byteLength < inputBuffer.byteLength,
} )
