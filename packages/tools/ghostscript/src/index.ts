
import { Compress }        from './core'
import { loadGhostscript } from './core/node'
import { init }            from './init'
import {
	CompressInput,
	CompressOptions,
} from './types'

export type {
	CompressInput,
	CompressOptions,
}

export { init }

export const compress = async (
	input: CompressInput,
	opts?: CompressOptions,
): Promise<ArrayBuffer> => {

	const gs       = await loadGhostscript()
	const instance = new Compress( gs )

	return instance.run( input, opts )

}
