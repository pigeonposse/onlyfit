
import { getImageData } from './core'
import { optimise }     from '../src/index'

const run = async () => {

	const image     = await getImageData()
	const optimised = await optimise( image.buffer )

	return {
		image,
		optimised,
		optimisedSize : optimised.byteLength,
	}

}

console.log( await run() ) // run()
