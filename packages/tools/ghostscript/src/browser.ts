
import { Compress } from './core'
import {
	init,
	getInstance,
} from './init'
import {
	CompressInput,
	CompressOptions,
} from './types'

export { init }

export const compress = async (
	input: CompressInput,
	opts?: CompressOptions,
): Promise<ArrayBuffer> => {

	const gs       = await getInstance()
	const instance = new Compress( gs )

	return instance.run( input, opts )

}
