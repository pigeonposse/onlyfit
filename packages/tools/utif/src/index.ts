import UTIF from 'utif2'

export { UTIF }

// e.g., 1 = none, 5 = LZW, 7 = JPEG (if supported), etc.
export type CompressOptions = { compression?: 1 | 5 }
/**
 * Compresses an ArrayBuffer containing a TIFF image using UTIF.js.
 *
 * @param   {ArrayBuffer}          input   - The ArrayBuffer of the original TIFF image.
 * @param   {CompressOptions}      [_opts] - Optional configuration options.
 * @returns {Promise<ArrayBuffer>}         A promise that resolves with the ArrayBuffer of the compressed TIFF image.
 * @throws {Error} If the input ArrayBuffer is not a valid TIFF or if an error occurs during compression.
 */
export const compress = async ( input: ArrayBuffer, _opts?: CompressOptions ) => {

	try {

		const ifds = UTIF.decode( input )
		if ( ifds.length === 0 ) throw new Error( 'No images found in the input TIFF ArrayBuffer.' )

		const ifd = ifds[0]
		UTIF.decodeImage( input, ifd )

		const rgba: Uint8Array<ArrayBufferLike> = UTIF.toRGBA8( ifd )

		// const compression = opts?.compression ?? 5
		// const supportedCompressions = new Set( [ 1, 5 ] )
		// if ( !supportedCompressions.has( compression ) )
		// 	throw new Error( `Unsupported compression type: ${compression}` )
		// const encodedIFD: Partial<UTIF.IFD> = { }

		// if ( typeof ifd.bps === 'number' && !isNaN( ifd.bps ) ) encodedIFD.bps = ifd.bps
		// if ( typeof ifd.samplesPerPixel === 'number' && !isNaN( ifd.samplesPerPixel ) ) encodedIFD.samplesPerPixel = ifd.samplesPerPixel
		// if ( typeof ifd.predictor === 'number' && !isNaN( ifd.predictor ) ) encodedIFD.predictor = ifd.predictor
		// if ( typeof ifd.photometricInterpretation === 'number' && !isNaN( ifd.photometricInterpretation ) )
		// 	encodedIFD.photometricInterpretation = ifd.photometricInterpretation

		const outputBuffer = UTIF.encodeImage(
			rgba,
			ifd.width!,
			ifd.height!,

		)

		return outputBuffer

	}
	catch ( error ) {

		throw new Error( `TIFF compression failed: ${error instanceof Error ? error.message : error?.toString()}` )

	}

}

