
import { deps } from '../_shared/deps'

import type { Options as GifskiOptimizeOptions } from '@onlyfit/gifski'
import type {
	OptimizeImageOptions as ImagemagickOptions,
	MagickFormat,
} from '@onlyfit/imagemagick'
import type { CompressOptions as JxlOptions }     from '@onlyfit/jxl'
import type { CompressOptions as LibAvifOptions } from '@onlyfit/libavif'
import type { CompressOptions as LibWebpOptions } from '@onlyfit/libwebp'
import type { CompressOptions as MozjpegOptions } from '@onlyfit/mozjpeg'
import type { optimise }                          from '@onlyfit/oxipng'
import type { CompressOptions as PngOptions }     from '@onlyfit/png'
import type { CompressOptions as QoiOptions }     from '@onlyfit/qoi'
import type { resize }                            from '@onlyfit/resize'

export type { GifskiOptimizeOptions }

type ResizeOptions = Parameters<typeof resize>[ 1 ]
type OxipngOptions = Parameters<typeof optimise>[ 1 ]
type ImageMagickConvertOptions = MagickFormat

export type {
	ImageMagickConvertOptions,
	JxlOptions,
	LibAvifOptions,
	LibWebpOptions,
	MozjpegOptions,
	OxipngOptions,
	PngOptions,
	QoiOptions,
}

export class ImageOptimize {

	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

	async jxl( opts?: JxlOptions ) {

		const { compress } = await deps.get( 'jxl' )
		return await compress( this.#input, opts )

	}

	async libavif( opts?: LibAvifOptions ) {

		const { compress } = await deps.get( 'libavif' )
		return await compress( this.#input, opts )

	}

	async libwebp( opts?: LibWebpOptions ) {

		const { compress } = await deps.get( 'libwebp' )
		return await compress( this.#input, opts )

	}

	async mozjpeg( opts?: MozjpegOptions ) {

		const { compress } = await deps.get( 'mozjpeg' )
		return await compress( this.#input, opts )

	}

	async oxipng( opts?: OxipngOptions ) {

		const { optimise } = await deps.get( 'oxipng' )
		return await optimise( this.#input, opts )

	}

	async png( opts?: PngOptions ) {

		const { compress } = await deps.get( 'png' )
		return await compress( this.#input, opts )

	}

	async qoi( opts?: QoiOptions ) {

		const { compress } = await deps.get( 'qoi' )
		return await compress( this.#input, opts )

	}

	async imagemagick( opts?: ImagemagickOptions ) {

		const { optimize } = await deps.get( 'imagemagick' )
		return await optimize( this.#input, opts )

	}

	async resize( opts?: ResizeOptions ) {

		console.log( 'resize coming soon', opts )
		// const { resize } = await deps.get( 'resize' )
		// return await resize( this.#input, opts )

	}

	async utif( ) {

		const { compress } = await deps.get( 'utif' )
		return await compress( this.#input )

	}

	async gifski( opts?: GifskiOptimizeOptions ) {

		const { compress } = await deps.get( 'gifski' )
		const res          = await compress( this.#input, opts )
		return res

	}

}

export class ImageConvert {

	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

	async imagemagick( opts: ImageMagickConvertOptions ) {

		const { convert } = await deps.get( 'imagemagick' )
		return await convert( this.#input, opts )

	}

}
