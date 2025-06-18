
import {
	description,
	homepage,
} from '../package.json'
import { TYPES } from './index'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const onlyfitPlugin = ( ): Plugin<PluginOptions> =>
	async utils => {

		const mimetypes = [ ...utils.mime.getAllTypes( Object.values( TYPES ) ) || [] ]
		return {
			data : {
				description,
				url : homepage,
			},
			optimizer : {
				mimetypes,

				fn : async ( { input } ) => {

					const { Compress } = await import( './index' )
					const cp           = new Compress( input )
					return await cp.run( )

				},
			},
			converter : {
				mimetypes,
				fn : async ( {
					input, to,
				} ) => {

					const { Convert } = await import( './index' )
					const toM         = TYPES[utils.mime.getExtension( to ) as keyof typeof TYPES]
					if ( !toM ) throw new Error( `Unsupported mimetype "${toM}" for conversion` )
					const cp = new Convert( input )
					return await cp.to( toM )

				},
			},
		}

	}
export default onlyfitPlugin
