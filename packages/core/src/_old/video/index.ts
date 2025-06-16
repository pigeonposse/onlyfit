
import { deps } from '../_shared/deps'

import type {
	AudioFormat,
	VideoFormat,
	VideoToOptions,
} from '@onlyfit/ffmpeg'

export class VideoOptimize {

	// eslint-disable-next-line no-unused-private-class-members
	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

}

export class VideoConvert {

	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

	async ffmpeg( from: VideoFormat, to: VideoFormat | AudioFormat, opts?: VideoToOptions ) {

		const {
			ConvertVideo, audioFormats,
		} = await deps.get( 'ffmpeg' )

		const convert     = new ConvertVideo( this.#input, from )
		const videoFormat = convert.formats.find( f => f === to )
		const audioFormat = audioFormats.find( f => f === to )

		if ( videoFormat )
			return await convert.to( videoFormat, opts )
		else if ( audioFormat )
			return await convert.toAudio( audioFormat )
		else
			throw new Error( 'Unsupported format' )

	}

}
