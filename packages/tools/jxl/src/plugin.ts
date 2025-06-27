import {
	description,
	homepage,
} from '../package.json'
import { InitOptions } from './index'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = {
	effort : {
		type        : 'range',
		value       : 7,
		min         : 0,
		max         : 9,
		label       : 'Effort',
		description : 'Encoding effort (0-9, higher = slower & better compression)',
		required    : false,
	},
	quality : {
		type        : 'range',
		value       : 75,
		min         : 0,
		max         : 100,
		label       : 'Quality',
		description : 'Output image quality (0-100)',
		required    : false,
	},
	progressive : {
		type        : 'boolean',
		value       : false,
		label       : 'Progressive',
		description : 'Enable progressive encoding',
		required    : false,
	},
	epf : {
		type        : 'range',
		min         : 0,
		max         : 3,
		value       : 1,
		label       : 'EPF',
		description : 'Edge-preserving filter (0-3)',
		required    : false,
	},
	lossyPalette : {
		type        : 'boolean',
		value       : false,
		label       : 'Lossy Palette',
		description : 'Use lossy palette compression',
		required    : false,
	},
	decodingSpeedTier : {
		type        : 'range',
		min         : 0,
		max         : 4,
		value       : 0,
		label       : 'Decoding Speed Tier',
		description : 'Speed tier for decoding (0 = slowest, 4 = fastest)',
		required    : false,
	},
	photonNoiseIso : {
		type        : 'number',
		value       : 0,
		label       : 'Photon Noise ISO',
		description : 'Simulate photon noise (ISO value)',
		required    : false,
	},
	lossyModular : {
		type        : 'boolean',
		value       : false,
		label       : 'Lossy Modular',
		description : 'Enable lossy modular mode',
		required    : false,
	},
} as const satisfies PluginOptions

const onlyfitPlugin = ( opts?: InitOptions ): Plugin<PluginOptions, typeof options> =>
	async utils => {

		return {
			data : {
				description,
				homepage,
			},
			init : async () => {

				if ( !opts ) return

				const { init } = await import( './index' )
				await init( opts )

			},
			optimizer : {
				options,
				mimetypes : [ utils.mime.getType( 'jxl' ) ].filter( f => typeof f === 'string' ),

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
