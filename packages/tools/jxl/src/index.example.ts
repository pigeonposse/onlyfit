import {
	ensureDir,
	getCurrentDir,
	joinPath,
	readFile,
	writeFile,
} from '@dovenv/core/utils'
import { DATA_PATH } from '@onlyfit/repo-config/data'

import { compress } from './index'

const inputFilePath  = DATA_PATH['jxl']
const buildDir       = joinPath( getCurrentDir( import.meta.url ), '..', 'build' )
const outputFilePath = joinPath( buildDir, 'compressed.jxl' )
await ensureDir( buildDir )

// await initEncode( null, { locateFile: path => `https://cdn.jsdelivr.net/npm/@jsquash/jxl/codec/enc/${path}` } )
// await initDecode( null, { locateFile: path => `https://cdn.jsdelivr.net/npm/@jsquash/jxl/codec/dec/${path}` } )
const run = async () => {

	const arrayBuffer = await readFile( inputFilePath )
	const result      = await compress( arrayBuffer )

	await writeFile( outputFilePath, Buffer.from( result ) )

	console.log( {
		input      : inputFilePath,
		output     : outputFilePath,
		outputSize : result.byteLength,
		inputSize  : arrayBuffer.byteLength,
	} )

}

run()
