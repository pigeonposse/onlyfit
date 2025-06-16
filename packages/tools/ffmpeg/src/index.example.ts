
import {
	ensureDir,
	getCurrentDir,
	joinPath,
	readFile,
	writeFile,
} from '@dovenv/core/utils'
import { DATA_PATH } from '@onlyfit/repo-config/data'

import {
	type AudioFormat,
	ConvertVideo,
	ConvertAudio,
} from './index'

const buildDir = joinPath( getCurrentDir( import.meta.url ), '..', 'build' )

await ensureDir( buildDir )

export const videoRun = async () => {

	const videoType = 'mp4'
	const input     = await readFile( DATA_PATH[videoType] )
	const cv        = new ConvertVideo( input, videoType )

	for ( const format of cv.formats ) {

		const arrayBuffer    = await cv.to( format )
		const outputFilePath = joinPath( buildDir, videoType + '_video_compressed.' + format )
		await writeFile( outputFilePath, Buffer.from( arrayBuffer ) )
		console.log( outputFilePath )

	}

}
export const video2audioRun = async () => {

	const videoType = 'mp4'
	const input     = await readFile( DATA_PATH[videoType] )
	const cv        = new ConvertVideo( input, videoType )
	console.log( 'init audio bytes: ' + input.byteLength )
	for ( const format of [ 'mp3' ] as AudioFormat[] ) {

		console.log( `video to audio: ${format}` )
		const arrayBuffer = await cv.toAudio( format )
		console.log( format + 'audio bytes: ' + arrayBuffer.byteLength )
		const outputFilePath = joinPath( buildDir, videoType + '_video2audio_compressed.' + format )
		await writeFile( outputFilePath, Buffer.from( arrayBuffer ) )
		console.log( outputFilePath )

	}

}

export const audioRun = async () => {

	const type  = 'mp3'
	const input = await readFile( DATA_PATH[type] )
	const cv    = new ConvertAudio( input, type )

	for ( const format of cv.formats ) {

		const arrayBuffer    = await cv.to( format )
		const outputFilePath = joinPath( buildDir, type + '_audio_compressed.' + format )
		await writeFile( outputFilePath, Buffer.from( arrayBuffer ) )
		console.log( outputFilePath )

	}

}

await audioRun()
// videoRun()
// await video2audioRun()
