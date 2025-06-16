import {
	Core,
	CoreOptions,
} from '../_shared'
import {
	AudioFormat,
	ConvertAudio,
} from '../audio'

export type VideoFormat =
	| 'mp4'
	| 'mov'
	| 'webm'
	| 'mkv'
	| 'gif'
	| 'mpeg'
	| 'ogg'
	| 'avi'
	| 'flv'

export const videoCodec = {
	mp4  : 'libx264', // H.264 video
	mov  : 'libx264', // H.264 in MOV container
	webm : 'libvpx', // VP8/VP9 for WebM
	mkv  : 'libx264', // H.264 in Matroska
	gif  : 'gif', // Animated GIF
	mpeg : 'mpeg1video', // MPEG-1 video
	ogg  : 'libtheora', // Theora codec (video in OGG)
	avi  : 'mpeg4', // MPEG-4 video (not H.264)
	flv  : 'flv1', // Flash Video
} as const satisfies Record<VideoFormat, string>

export const videoFormats = Object.keys( videoCodec ) as VideoFormat[]

export type VideoToOptions = {
	/**
	 * @default true
	 */
	codecs? : boolean
	/**
	 * @see https://ffmpeg.org/ffmpeg-all.html
	 */
	args?   : string[]
}

export class ConvertVideo extends Core {

	#input  : ArrayBuffer
	#format : VideoFormat

	formats = videoFormats
	codec = videoCodec

	constructor( input: ArrayBuffer, format: VideoFormat, opts?: CoreOptions ) {

		super( opts )
		this.#input  = input
		this.#format = format

	}

	async to( outputFormat: VideoFormat, opts?: VideoToOptions ): Promise<ArrayBuffer> {

		const uid         = Date.now() + Math.random().toString( 36 ).slice( 2 )
		const inputName   = `input_${uid}.${this.#format}`
		const outputName  = `output_${uid}.${outputFormat}`
		const videoCodecv = videoCodec[outputFormat]
		const args        = [ ...opts?.args || [], ...( opts?.codecs === false ? [] : [ '-c:v', videoCodecv ] ) ]

		return await this.execute( {
			inputName,
			outputName,
			args,
			input : this.#input,
		} )

	}

	// TODO: FIX FUNCTION
	async #videotoMp3(): Promise<ArrayBuffer> {

		const uid        = Date.now() + Math.random().toString( 36 ).slice( 2 )
		const inputName  = `input_${uid}.${this.#format}`
		const outputName = `output_${uid}.mp3`
		const args       = [ '-vn' ]

		return await this.execute( {
			inputName,
			outputName,
			args,
			input : this.#input,
		} )

	}

	async toAudio( format?: AudioFormat ) {

		if ( !format ) format = 'mp3'
		const arrayBuffer = await this.#videotoMp3()
		if ( format === 'mp3' ) return arrayBuffer

		const audio = new ConvertAudio( arrayBuffer, 'mp3' )
		return await audio.to( format )

	}

}
