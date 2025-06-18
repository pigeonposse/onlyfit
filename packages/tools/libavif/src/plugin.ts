import {
	description,
	homepage,
} from '../package.json'
import { InitOptions } from './index'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const onlyfitPlugin = ( opts?: InitOptions ): Plugin<PluginOptions> =>
	async () => {

		return {
			data : {
				description,
				url : homepage,
			},
			optimizer : {
				mimetypes : [ 'image/avif' ],

				fn : async ( { input } ) => {

					const {
						compress, init,
					} = await import( './index' )

					if ( opts ) await init( opts )

					return await compress( input )

				},
			},
		}

	}
export default onlyfitPlugin
