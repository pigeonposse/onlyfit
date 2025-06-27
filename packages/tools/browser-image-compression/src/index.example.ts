
import {
	ensureDir,
	getCurrentDir,
	joinPath,
	readFile,
	writeFile,
} from '@dovenv/core/utils'
import { DATA_PATH } from '@onlyfit/repo-config/data'

import { optimize } from '.'

const buildDir = joinPath( getCurrentDir( import.meta.url ), '..', 'build' )

await ensureDir( buildDir )

const compressed = await optimize( await readFile( DATA_PATH['jpg'] ), 'image/jpeg', {} )

await writeFile( joinPath( buildDir, 'compressed.jpg' ), Buffer.from( compressed ) )

console.log( compressed.byteLength )
