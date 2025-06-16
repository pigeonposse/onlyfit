import {
	ensureDir,
	getCurrentDir,
	joinPath,
	writeFile,
} from '@dovenv/core/utils'

import { compress } from '.'

const url = await ( await fetch( 'https://media.giphy.com/media/W01rR5tEkZoVkCUGlT/200.gif' ) ).arrayBuffer()

const buildDir = joinPath( getCurrentDir( import.meta.url ), '..', 'build' )
await ensureDir( buildDir )
const gif = await compress( url, { quality: 20 } )

await writeFile( joinPath( buildDir, 'compressed.gif' ), gif )
