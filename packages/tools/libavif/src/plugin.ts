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
			init : async () => {

				if ( !opts ) return

				const { init } = await import( './index' )
				await init( opts )

			},
			optimizer : {
				mimetypes : [ 'image/avif' ],

				fn : async ( { input } ) => {

					const { compress } = await import( './index' )

					return await compress( input )

				},
			},
		}

	}
export default onlyfitPlugin
