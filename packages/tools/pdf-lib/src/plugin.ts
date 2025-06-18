
import {
	description,
	homepage,
} from '../package.json'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const onlyfitPlugin = ( ): Plugin<PluginOptions> =>
	async utils => {

		return {
			data : {
				description,
				url : homepage,
			},
			optimizer : {
				mimetypes : [ utils.mime.getType( 'pdf' ) ].filter( f => typeof f === 'string' ),

				fn : async ( { input } ) => {

					const { compress } = await import( './index' )

					const res = await compress( input )
					return res

				},
			},
		}

	}
export default onlyfitPlugin
