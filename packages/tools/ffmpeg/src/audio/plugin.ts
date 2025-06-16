
import { CoreOptions } from '../_shared'
import { AudioFormat } from '../index'

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
			ConvertAudio, audioFormats,
		} = await import( './index' )
		const mimetypes = audioFormats.map( f => utils.mime.getType( f ) ).filter( f => typeof f === 'string' )

		return {
			id : 'ffmpeg-audio',

			converter : {
				mimetypes,
				fn : async ( {
					input, from, to, options,
				} ) => {

					const fromType = utils.mime.getExtension( from ) as AudioFormat
					if ( !fromType ) throw new Error( 'Unsupported format in input' )
					const toType = utils.mime.getExtension( to ) as AudioFormat
					if ( !toType ) throw new Error( 'Unsupported format in input' )

					const convert     = new ConvertAudio( input, fromType, opts )
					const audioFormat = convert.formats.find( f => f === toType )

					if ( audioFormat ) return await convert.to( audioFormat, options )

					throw new Error( 'Unsupported format in converted output' )

				},
			},
		}

	}

export default plugin
