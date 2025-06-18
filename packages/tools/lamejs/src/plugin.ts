import {
	description,
	homepage,
} from '../package.json'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = { bitrate : {
	value       : 128,
	type        : 'number',
	label       : 'Bitrate',
	description : 'Bitrate in kbps.',
} } as const satisfies PluginOptions

const onlyfitPlugin = ( ): Plugin<PluginOptions, typeof options> =>
	async utils => {

		return {
			data : {
				description,
				url : homepage,
			},
			converter : {
				options,
				mimetypes : [
					{
						from : [ utils.mime.getType( 'wav' ) as string ],
						to   : [ utils.mime.getType( 'mp3' ) as string ],
					},
				],

				fn : async ( {
					input, options,
				} ) => {

					const { wav2mp3 } = await import( './index' )

					return await wav2mp3( input, options )

				},
			},
		}

	}
export default onlyfitPlugin
