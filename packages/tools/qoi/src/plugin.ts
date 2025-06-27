
import {
	description,
	homepage,
} from '../package.json'

import type { InitOptions } from './index'
import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = {
	maxColors : {
		type        : 'number',
		value       : 256,
		label       : 'Max Colors',
		description : 'Reduce the number of colors (default: 256)',
	},
	removeAlpha : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Alpha',
		description : 'Remove alpha channel from the image',
	},
} as const satisfies PluginOptions

const onlyfitPlugin = ( opts?: InitOptions ): Plugin<PluginOptions, typeof options> =>
	async () => {

		return {
			data : {
				description,
				url : homepage,
			},
			init : async () => {

				if ( !opts ) return

				const { init } = await import( './index' )
				await init( opts )

			},
			optimizer : {
				options,
				mimetypes : [ 'image/qoi' ],

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
