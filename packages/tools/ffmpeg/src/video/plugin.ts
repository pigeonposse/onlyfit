
import { CoreOptions } from '../_shared'
import {
	audioFormats,
	VideoFormat,
} from '../index'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

export const options = {
	codecs : {
		value       : true,
		type        : 'boolean',
		label       : 'Codecs',
		description : 'Enable or disable codecs.',
	},
	args : {
		value       : [ '' ],
		type        : 'arrayString',
		label       : 'Arguments',
		description : 'Arguments for ffmpeg.',
	},
} satisfies PluginOptions

const plugin = ( opts?: CoreOptions ): Plugin<PluginOptions, typeof options> =>
	async utils => {

		const {
			ConvertVideo, videoFormats,
		} = await import( './index' )
		const exts = videoFormats.map( f => utils.mime.getType( f ) ).filter( f => typeof f === 'string' )

		return {
			id : 'ffmpeg-video',

			converter : {
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

export default plugin
