
import { type init } from './index'
import {
	description,
	homepage,
} from '../package.json'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = { minify : {
	value       : true,
	type        : 'boolean',
	label       : 'Minify',
	description : 'Enable or disable minification.',
} } as const satisfies PluginOptions

const onlyfitPlugin = ( opts?: Parameters<typeof init>[ 0 ] ): Plugin<PluginOptions, typeof options> =>
	async utils => {

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
				mimetypes : [ utils.mime.getType( 'css' ) ].filter( f => typeof f === 'string' ),

				fn : async ( {
					input, options,
				} ) => {

					const { compress } = await import( './index' )

					const res = await compress( utils.convert.arrayBuffer2uint8Array( input ), options )
					return utils.convert.uint8Array2arrayBuffer( res )

				},
			},
		}

	}
export default onlyfitPlugin
