
import {
	Core,
	CoreOptions,
} from '../_shared'

export type AudioFormat =
	| 'mp3'
	| 'aac'
	| 'opus'
	| 'flac'
	| 'wav'
	| 'ogg'
	| 'webm'
	| 'aiff'

export const audioCodec = {
	mp3  : 'libmp3lame',
	aac  : 'libfdk_aac',
	opus : 'libopus',
	flac : 'flac',
	wav  : 'pcm_s16le',
	ogg  : 'libvorbis',
	webm : 'libopus',
	aiff : 'pcm_s16be',
} as const satisfies Record<AudioFormat, string>

export const audioFormats = Object.keys( audioCodec ) as AudioFormat[]

export type AudioToOptions = {
	/**
	 * @default true
	 */
	codecs? : boolean
	/**
	 * @see https://ffmpeg.org/ffmpeg-all.html
	 */
	args?   : string[]
}

export class ConvertAudio extends Core {

	#input  : ArrayBuffer
	#format : AudioFormat
	formats = audioFormats
	codec = audioCodec

	constructor( input: ArrayBuffer, format: AudioFormat, opts?: CoreOptions ) {

		super( opts )

		this.#input  = input
		this.#format = format

	}

	async to( outputFormat: AudioFormat, opts?: AudioToOptions ): Promise<ArrayBuffer> {

		const uid         = Date.now() + Math.random().toString( 36 ).slice( 2 )
		const inputName   = `input_${uid}.${this.#format}`
		const outputName  = `output_${uid}.${outputFormat}`
		const audioCodecV = audioCodec[outputFormat]
		const args        = [ ...opts?.args || [], ...( opts?.codecs === false ? [] : [ '-c:a', audioCodecV ] ) ]

		return await this.execute( {
			inputName,
			outputName,
			args,
			input : this.#input,
		} )

	}

}
