
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

import { Convert } from '.'

const buildDir = joinPath( getCurrentDir( import.meta.url ), '..', 'build' )

await ensureDir( buildDir )
const inputTypes     = [
	'woff2',
	'ttf',
	'otf',
	'eot',
] as const
const convertedTypes = [
	'woff2',
	'ttf',
	'otf',
	'eot',
	'svg',
	'woff',
]

for ( const inputType of inputTypes ) {

	const path = DATA_PATH[inputType]
	const file = await readFile( path )

	for ( const convertedType of convertedTypes ) {

		console.log( `Converting ${inputType} to ${convertedType}` )
		const convert = new Convert( file, inputType )
		const output  = await convert.ttf()
		await writeFile(
			joinPath( buildDir, `from-${inputType}.${convertedType}` ),
			Buffer.from( output ),
		)

	}

}
