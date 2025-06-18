
import {
	description,
	homepage,
} from '../package.json'

import type { init } from './index'
import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = { bitDepth : {
	type    : 'selectNumber',
	label   : 'Bit Depth',
	options : [
		{
			value : 8,
			label : '8-bit',
		},
	],
} } as const satisfies PluginOptions

const onlyfitPlugin = ( opts?: Parameters<typeof init>[ 0 ] ): Plugin<PluginOptions, typeof options> =>
	async utils => {

		return {
			data : {
				description,
				url : homepage,
			},
			optimizer : {
				options,
				mimetypes : [ utils.mime.getType( 'webp' ) ].filter( f => typeof f === 'string' ),

				fn : async ( {
					input, options,
				} ) => {

					const {
						compress, init,
					} = await import( './index' )

					if ( opts ) await init( opts )

					return await compress( input, options )

				},
			},
		}

	}
export default onlyfitPlugin
