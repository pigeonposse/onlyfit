#!/usr/bin/env node
import {
	constants,
	access,
} from 'node:fs/promises'
import {
	readFile,
	writeFile,
	mkdir,
	stat,
} from 'node:fs/promises'
import { dirname } from 'node:path'
import process     from 'node:process'
import { hideBin } from 'yargs/helpers'

import { Cli }   from './index'
import { isURL } from './utils'

const existsDir = async ( path: string ) => {

	try {

		await access( path, constants.F_OK )
		const stats = await stat( path )
		return stats.isDirectory()

	}
	catch ( _error ) {

		return false

	}

}

const ensureDir = async ( path: string ) => {

	const exist = await existsDir( path )
	if ( !exist ) await mkdir( path, { recursive: true } )

}

new Cli( {
	args           : hideBin( process.argv ),
	basePath       : process.cwd(),
	transformInput : async ( { path } ) => {

		if ( isURL( path ) ) {

			const res = await fetch( path )
			if ( !res.ok ) throw new Error( `Failed to fetch URL: ${res.status} ${res.statusText}` )
			const input = await res.arrayBuffer()
			return input

		}
		const buffer      = await readFile( path )
		const arrayBuffer = buffer.buffer.slice( buffer.byteOffset, buffer.byteOffset + buffer.byteLength )

		return arrayBuffer as ArrayBuffer

	},
	transformOutput : async ( {
		input, path,
	} ) => {

		await ensureDir( dirname( path ) )
		await writeFile( path, Buffer.from( input ) )

	},
} ).run()
