
import {
	ensureDir,
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'
import { DATA_PATH } from '@onlyfit/repo-config/data'
import {
	readFile,
	writeFile,
} from 'fs/promises'

import { compress } from '.'

const buildDir                  = joinPath( getCurrentDir( import.meta.url ), '..', 'build' )
const inputFilePath             = DATA_PATH['tiff']
const outputFilePathUtifDeflate = joinPath( buildDir, 'compressed.tiff' )
await ensureDir( buildDir )

console.log( `Reading TIFF file: ${inputFilePath}` )
const originalArrayBuffer = await readFile( inputFilePath )
console.log( `Original size: ${originalArrayBuffer.byteLength} bytes` )

console.log( 'Compressing image...' )

const compressedArrayBuffer = await compress( originalArrayBuffer )

console.log( `Compressed size: ${compressedArrayBuffer.byteLength} bytes` )

await writeFile( outputFilePathUtifDeflate, Buffer.from( compressedArrayBuffer ) )
console.log( `Compressed file saved to: ${outputFilePathUtifDeflate}` )

