
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

import {
	compress,
	init,
} from '.'

const ext           = 'jpg'
const buildDir      = joinPath( getCurrentDir( import.meta.url ), '..', 'build' )
const inputFilePath = DATA_PATH[ext]

await ensureDir( buildDir )

await init( {
	encode : async ( { fetchFromCDNs } ) => await fetchFromCDNs(),
	decode : async ( { fetchFromCDNs } ) => await fetchFromCDNs(),
} )

const time = () => new Date().toLocaleTimeString() + '.' + new Date().getMilliseconds().toString().padStart( 3, '0' )
const run  = async () => {

	const id    = crypto.randomUUID()
	const label = id

	console.time( label )
	const startedAt                 = time()
	const outputFilePathUtifDeflate = joinPath( buildDir, 'compressed.' + id + '.' + ext )
	const originalArrayBuffer       = await readFile( inputFilePath )
	const compressedArrayBuffer     = await compress( originalArrayBuffer )
	await writeFile( outputFilePathUtifDeflate, Buffer.from( compressedArrayBuffer ) )
	const endedAt = time()

	console.log( 'Data for: ' + label )

	console.log( `Reading file: ${inputFilePath}` )
	console.log( `Original size: ${originalArrayBuffer.byteLength} bytes` )
	console.log( `Compressed size: ${compressedArrayBuffer.byteLength} bytes` )
	console.log( `Compressed file saved to: ${outputFilePathUtifDeflate}` )
	console.log( `Started at: ${startedAt}` )
	console.log( `Ended at: ${endedAt}` )
	console.timeEnd( label )

}
await Promise.all( [
	run( ),
	run( ),
	run( ),
	// run( ),
	// run( ),
] )
