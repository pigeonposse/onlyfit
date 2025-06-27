import {
	description,
	homepage,
} from '../package.json'
import { InitInput } from './index'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = {
	fps : {
		value       : 24,
		type        : 'number',
		label       : 'Fps',
		description : 'Frames per second.',
	},
	quality : {
		value       : 80,
		type        : 'range',
		min         : 0,
		max         : 100,
		label       : 'Quality',
		description : 'Quality (0-100).',
	},
} as const satisfies PluginOptions

const onlyfitPlugin = ( opts?: { wasmInput?: InitInput } ): Plugin<PluginOptions, typeof options> =>
	async () => {

		return {
			data : {
				description,
				homepage,
			},
			init : async () => {

				if ( !opts?.wasmInput ) return
				const { init } = await import( './index' )
				await init( opts.wasmInput )

			},
			optimizer : {
				options,
				mimetypes : [ 'image/gif' ],

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
