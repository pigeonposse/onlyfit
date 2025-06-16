import pkg from 'fonteditor-core/package.json'

import { convertFontFormats } from './utils'
import {
	description,
	homepage,
} from '../package.json'

import type { ConvertOptions } from './index'
import type { FontFormat }     from './utils'
import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const onlyfitPlugin = ( opts?: ConvertOptions ): Plugin<PluginOptions> =>
	async utils => ( {
		data : {
			description,
			homepage,
			pkg,
		},
		converter : {
			mimetypes : convertFontFormats.map( f => utils.mime.getType( f ) ).filter( f => typeof f === 'string' ),

			fn : async ( {
				input, from, to,
			} ) => {

				const { Convert } = await import( './index' )
				const ext         = utils.mime.getExtension( from ) as FontFormat
				const toExt       = utils.mime.getExtension( to ) as FontFormat
				if ( !ext ) throw new Error( 'Unsupported format in input' )
				if ( !toExt ) throw new Error( 'Unsupported format in output' )

				const cv = new Convert( input, ext, opts )

				const res = await cv.to( toExt )
				return res

			},
		},
	} )

export default onlyfitPlugin
