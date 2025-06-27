
import {
	description,
	homepage,
} from '../package.json'

import type { InitCoreOptions } from './index'
import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = {
	level : {
		type        : 'range',
		min         : 0,
		max         : 6,
		label       : 'Compression Level',
		description : 'Compression level (0-6)',
	},
	interlace : {
		type        : 'boolean',
		label       : 'Interlace',
		description : 'Enable Adam7 interlacing',
	},
	optimiseAlpha : {
		type        : 'boolean',
		label       : 'Optimise Alpha',
		description : 'Perform lossless alpha optimization',
	},
} as const satisfies PluginOptions

const onlyfitPlugin = ( opts?: InitCoreOptions ): Plugin<PluginOptions, typeof options> =>
	async utils => {

		return {
			data : {
				description,
				url : homepage,
			},
			init : async () => {

				if ( !opts ) return

				const { init } = await import( './index' )
				init( opts )

			},
			optimizer : {
				options,
				mimetypes : [ utils.mime.getType( 'webp' ) ].filter( f => typeof f === 'string' ),

				fn : async ( {
					input, options,
				} ) => {

					const { optimise } = await import( './index' )

					return await optimise( input, options )

				},
			},
		}

	}
export default onlyfitPlugin
