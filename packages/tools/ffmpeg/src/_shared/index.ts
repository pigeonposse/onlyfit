import { FFmpeg } from '@ffmpeg.wasm/main'

const isBrowser: boolean = typeof window !== 'undefined' && typeof window.document !== 'undefined'
export type CoreOptions = Parameters<typeof FFmpeg['create']>[0]

export type ExecuteOptions = {
	input      : ArrayBuffer
	args?      : string[]
	inputName  : string
	outputName : string
}

export class Core {

	#options : CoreOptions
	constructor( opts?: CoreOptions ) {

		this.#options = opts

	}

	_FFmpeg = FFmpeg

	async createFFmpegInstance( opts?: CoreOptions ) {

		const core = opts?.core || ( !isBrowser ? '@ffmpeg.wasm/core-mt' : undefined )

		return await FFmpeg.create( {
			...opts || {},
			core,
		} )

	}

	async execute( opts: ExecuteOptions ) {

		const ffmpeg = await this.createFFmpegInstance( this.#options )

		if ( !ffmpeg ) throw new Error( 'FFmpeg not loaded. Call createInstance() first' )

		const {
			inputName, outputName, args, input,
		} = opts

		if ( input.byteLength === 0 ) throw new Error( 'Input buffer is empty' )

		const inputFile = new Uint8Array( input )
		await ffmpeg.fs.writeFile( inputName, inputFile )
		const argv = [
			'-i',
			inputName,
			...args || [],
			outputName,
		]
		// console.log(argv)
		const code = await ffmpeg.run( ...argv )
		if ( code !== 0 ) throw new Error( 'Error executing FFmpeg command with code: ' + code )
		const outputData = await ffmpeg.fs.readFile( outputName )

		if ( !outputData || outputData.length === 0 ) throw new Error( 'Output file is empty. FFmpeg execution likely failed.' )
		// console.log( ffmpeg.fs.readdir( '/' ) )
		await ffmpeg.fs.unlink( inputName )
		await ffmpeg.fs.unlink( outputName )

		return outputData

	}

}
