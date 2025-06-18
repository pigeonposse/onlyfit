
import {
	description,
	homepage,
} from '../package.json'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = { compression : {
	type    : 'selectNumber',
	label   : 'Compression type',
	options : [
		{
			value : 1,
			label : 'none',
		},
		{
			value : 5,
			label : 'LZW',
		},
	],
	description : 'Reduce the number of colors (default: 256)',
} } as const satisfies PluginOptions

const onlyfitPlugin = ( ): Plugin<PluginOptions, typeof options> =>
	async () => {

		return {
			data : {
				description,
				url : homepage,
			},
			optimizer : {
				options,
				mimetypes : [ 'image/tiff', 'image/tiff-fx' ],

				fn : async ( {
					input, options,
				} ) => {

					const { compress } = await import( './index' )

					return await compress( input, options )

				},
			},
		}

	}
export default onlyfitPlugin
