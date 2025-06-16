import {
	describe,
	it,
	expect,
} from 'vitest'

import { getImageData } from './core'
import { optimise }     from '../src/index'

describe( 'Oxipng Optimisation (Node.js)', () => {

	it( 'should optimize a PNG image buffer', async () => {

		const image           = await getImageData()
		const optimisedBuffer = await optimise( image.buffer )
		// expect( optimisedBuffer ).toBeInstanceOf( ArrayBuffer )
		expect( optimisedBuffer.byteLength ).toBeLessThanOrEqual( image.size )

		console.log( `Optimized size: ${optimisedBuffer.byteLength} bytes` )
		console.log( `Reduction: ${image.size - optimisedBuffer.byteLength} bytes` )

	}, 10000 )

} )
