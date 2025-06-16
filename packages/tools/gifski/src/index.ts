import encode, { init } from 'gifski-wasm'
import {
	parseGIF,
	decompressFrames,
} from 'gifuct-js'

export type Options = {
	fps?     : number
	quality? : number
}
export {
	encode,
	init,
}

export const compress = async (
	input: Buffer | ArrayBuffer,
	options: Options = {},
): Promise<Uint8Array> => {

	const {
		fps = 50,
		quality = 80,
	} = options

	const gifData = input instanceof ArrayBuffer
		? input
		: input.buffer.slice( input.byteOffset, input.byteOffset + input.byteLength )

	const parsed        = parseGIF( gifData )
	const decodedFrames = decompressFrames( parsed, true )

	if ( decodedFrames.length === 0 )
		throw new Error( 'No frames found in GIF' )

	const {
		width,
		height,
	} = decodedFrames[0].dims

	const canvas               = new Uint8ClampedArray( width * height * 4 ).fill( 0 )
	const frames: Uint8Array[] = []

	for ( const frame of decodedFrames ) {

		const {
			dims: {
				width: fw, height: fh, top, left,
			},
			patch,
			disposalType,
		} = frame

		// Keep a copy of canvas before drawing this frame (for restoration if needed)
		const canvasBefore = canvas.slice()

		// Blit patch onto canvas
		for ( let y = 0; y < fh; y++ ) {

			for ( let x = 0; x < fw; x++ ) {

				const destX = left + x
				const destY = top + y
				if ( destX >= width || destY >= height ) continue

				const destIndex = ( destY * width + destX ) * 4
				const srcIndex  = ( y * fw + x ) * 4

				canvas[destIndex + 0] = patch[srcIndex + 0]
				canvas[destIndex + 1] = patch[srcIndex + 1]
				canvas[destIndex + 2] = patch[srcIndex + 2]
				canvas[destIndex + 3] = patch[srcIndex + 3]

			}

		}

		// Save full canvas as frame
		frames.push( new Uint8Array( canvas ) )

		// Handle disposal method
		if ( disposalType === 2 ) {

			// Restore background (clear patch area)
			for ( let y = 0; y < fh; y++ ) {

				for ( let x = 0; x < fw; x++ ) {

					const destX = left + x
					const destY = top + y
					if ( destX >= width || destY >= height ) continue

					const destIndex       = ( destY * width + destX ) * 4
					canvas[destIndex + 0] = 0
					canvas[destIndex + 1] = 0
					canvas[destIndex + 2] = 0
					canvas[destIndex + 3] = 0

				}

			}

		}
		else if ( disposalType === 3 ) {

			// Restore previous
			canvas.set( canvasBefore )

		}

	}

	const gif = await encode( {
		frames,
		width,
		height,
		fps,
		quality,
	} )

	return gif

}
