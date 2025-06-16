export type OptimizeImageOptions = {
	/**
	 * Reduce the number of colors (default: 256)
	 */
	maxColors?   : number
	removeAlpha? : boolean
}

export const optimizeImageData = ( input: ImageData, options: OptimizeImageOptions = {} ): ImageData => {

	const {
		maxColors = 256, removeAlpha = false,
	} = options
	const {
		data, width, height,
	} = input
	const newData = new Uint8ClampedArray( data.length )

	const palette = new Map<string, number>()

	for ( let i = 0; i < data.length; i += 4 ) {

		const r = data[i]
		const g = data[i + 1]
		const b = data[i + 2]
		const a = data[i + 3]

		// Remove alpha if not needed
		const alpha = removeAlpha ? 255 : a

		const key = `${r >> 3}-${g >> 3}-${b >> 3}-${alpha >> 3}`

		if ( !palette.has( key ) ) {

			palette.set( key, palette.size )
			if ( palette.size > maxColors ) {

				// Optional: Stop adding new colors if limit is reached
				// You could also quantize more aggressively here
				continue

			}

		}

		// Reuse colors (quantization)
		const quantR = ( r >> 3 ) << 3
		const quantG = ( g >> 3 ) << 3
		const quantB = ( b >> 3 ) << 3
		const quantA = ( alpha >> 3 ) << 3

		newData[i]     = quantR
		newData[i + 1] = quantG
		newData[i + 2] = quantB
		newData[i + 3] = quantA

	}

	return new ImageData( newData, width, height )

}
