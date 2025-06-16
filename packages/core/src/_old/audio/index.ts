
import { AudioFormat } from '@onlyfit/ffmpeg'

import { deps } from '../_shared/deps'

import type { AudioToOptions }                         from '@onlyfit/ffmpeg'
import type { Wav2Mp3Options as LamejsConvertOptions } from '@onlyfit/lamejs'

export class AudioOptimize {

	// eslint-disable-next-line no-unused-private-class-members
	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

}

export class AudioConvert {

	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

	async lamejs( opts?: LamejsConvertOptions ) {

		const { wav2mp3: convert } = await deps.get( 'lamejs' )

		return await convert( this.#input, opts )

	}

	async ffmpeg( from: AudioFormat, to: AudioFormat, opts?: AudioToOptions ) {

		const { ConvertAudio } = await deps.get( 'ffmpeg' )

		const convert = new ConvertAudio( this.#input, from )
		return await convert.to( to, opts )

	}

}
