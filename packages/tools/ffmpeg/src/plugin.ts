
import { AudioFormat } from '../dist'
import { CoreOptions } from './_shared'
import {
	audioFormats,
	VideoFormat,
} from './index'
import pkg from '../package.json'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

export const options = {
	codecs : {
		value       : true,
		type        : 'boolean',
		label       : 'Codecs',
		description : 'Enable or disable codecs',
	},
	args : {
		value       : [ '' ],
		type        : 'arrayString',
		label       : 'Arguments',
		description : 'Arguments for ffmpeg commmand',
	},
} satisfies PluginOptions

export const audioPlugin = ( opts?: CoreOptions ): Plugin<PluginOptions, typeof options> =>
	async utils => {

		const {
			ConvertAudio, audioFormats,
		} = await import( './index' )
		const mimetypes = audioFormats.map( f => utils.mime.getType( f ) ).filter( f => typeof f === 'string' )

		return {
			data : {
				description : pkg.description,
				url         : pkg.homepage,
			},
			converter : {
				mimetypes,
				options,
				fn : async ( {
					input, from, to, options,
				} ) => {

					const fromType = utils.mime.getExtension( from ) as AudioFormat
					if ( !fromType ) throw new Error( 'Unsupported format in input' )
					const toType = utils.mime.getExtension( to ) as AudioFormat
					if ( !toType ) throw new Error( 'Unsupported format in input' )

					const convert     = new ConvertAudio( input, fromType, opts )
					const audioFormat = convert.formats.find( f => f === toType )

					if ( audioFormat )
						return await convert.to( audioFormat, options )

					throw new Error( 'Unsupported format in converted output' )

				},
			},
		}

	}

export const videoPlugin = ( opts?: CoreOptions ): Plugin<PluginOptions, typeof options> =>
	async utils => {

		const {
			ConvertVideo, videoFormats,
		} = await import( './index' )
		const exts = videoFormats.map( f => utils.mime.getType( f ) ).filter( f => typeof f === 'string' )

		return {
			data : {
				description : pkg.description,
				url         : pkg.homepage,
			},
			converter : {
				options,
				mimetypes : exts,
				fn        : async ( {
					input, from, to, options,
				} ) => {

					const fromType = utils.mime.getExtension( from ) as VideoFormat
					if ( !fromType ) throw new Error( 'Unsupported format in input' )

					const convert     = new ConvertVideo( input, fromType, opts )
					const videoFormat = convert.formats.find( f => f === to )
					const audioFormat = audioFormats.find( f => f === to )

					if ( videoFormat )
						return await convert.to( videoFormat, options )
					else if ( audioFormat )
						return await convert.toAudio( audioFormat )

					throw new Error( 'Unsupported format in converted output' )

				},
			},
		}

	}

const plugins = ( opts?: CoreOptions ) => ( {
	'ffmpeg-audio' : audioPlugin( opts ),
	'ffmpeg-video' : videoPlugin( opts ),
} )
export default plugins
