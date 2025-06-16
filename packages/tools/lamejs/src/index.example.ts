import {
	ensureDir,
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'
import { DATA_PATH } from '@onlyfit/repo-config/data'
import {
	readFileSync,
	writeFileSync,
} from 'fs'
import { join } from 'path'

import { wav2mp3 } from './wav'

const inputFilePath  = DATA_PATH['wav']
const buildDir       = joinPath( getCurrentDir( import.meta.url ), '..', 'build' )
const outputFilePath = join( buildDir, 'audio_compressed.mp3' )
await ensureDir( buildDir )

console.log( `Leyendo WAV: ${inputFilePath}` )

try {

	const wavNodeBuffer  = readFileSync( inputFilePath )
	const wavArrayBuffer = wavNodeBuffer.buffer.slice(
		wavNodeBuffer.byteOffset,
		wavNodeBuffer.byteOffset + wavNodeBuffer.byteLength,
	)

	console.log( `Original: ${wavArrayBuffer.byteLength} bytes` )
	const mp3ArrayBuffer = await wav2mp3( wavArrayBuffer, { bitrate: 96 } )
	const mp3NodeBuffer  = Buffer.from( mp3ArrayBuffer )

	writeFileSync( outputFilePath, mp3NodeBuffer )

	console.log( `Comprimido y guardado en: ${outputFilePath}` )
	console.log( `MP3: ${mp3ArrayBuffer.byteLength} bytes` )

}
catch ( error ) {

	console.error( 'Error:', error )

}
