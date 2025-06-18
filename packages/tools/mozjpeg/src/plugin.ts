/* eslint-disable camelcase */
import {
	description,
	homepage,
} from '../package.json'
import { InitOptions } from './init'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = {
	quality : {
		type        : 'range',
		value       : 75,
		min         : 0,
		max         : 100,
		label       : 'Quality',
		description : 'Image quality factor (0-100)',
	},
	baseline : {
		type        : 'boolean',
		label       : 'Baseline',
		description : 'Use baseline JPEG (no progressive)',
	},
	arithmetic : {
		type        : 'boolean',
		label       : 'Arithmetic Coding',
		description : 'Use arithmetic coding instead of Huffman',
	},
	progressive : {
		type        : 'boolean',
		label       : 'Progressive',
		description : 'Create progressive JPEG',
	},
	optimize_coding : {
		type        : 'boolean',
		label       : 'Optimize Coding',
		description : 'Optimize Huffman coding tables',
	},
	smoothing : {
		type        : 'range',
		min         : 0,
		max         : 100,
		label       : 'Smoothing',
		description : 'Smoothing factor (0-100)',
	},
	color_space : {
		type    : 'select',
		label   : 'Color Space',
		options : [
			{
				value : 1,
				label : 'Grayscale',
			},
			{
				value : 3,
				label : 'YCbCr',
			},
			{
				value : 2,
				label : 'RGB',
			},
		],
		description : 'Color space for JPEG compression',
	},
	quant_table : {
		type        : 'range',
		value       : 3,
		min         : 0,
		max         : 8,
		label       : 'Quantization Table',
		description : 'Quantization table index (0-8)',
	},
	trellis_multipass : {
		type        : 'boolean',
		label       : 'Trellis Multipass',
		description : 'Enable multiple trellis optimization passes',
	},
	trellis_opt_zero : {
		type        : 'boolean',
		label       : 'Trellis Optimize Zero',
		description : 'Enable optimization for zero coefficients',
	},
	trellis_opt_table : {
		type        : 'boolean',
		label       : 'Trellis Optimize Table',
		description : 'Optimize quantization tables during trellis',
	},
	trellis_loops : {
		type        : 'number',
		label       : 'Trellis Loops',
		description : 'Number of trellis optimization loops',
	},
	auto_subsample : {
		type        : 'boolean',
		label       : 'Auto Subsample',
		description : 'Automatically choose chroma subsampling',
	},
	chroma_subsample : {
		type        : 'number',
		label       : 'Chroma Subsample',
		description : 'Chroma subsampling (0=none, 1=half, 2=default)',
	},
	separate_chroma_quality : {
		type        : 'boolean',
		label       : 'Separate Chroma Quality',
		description : 'Enable separate quality for chroma',
	},
	chroma_quality : {
		type        : 'range',
		min         : 0,
		max         : 100,
		label       : 'Chroma Quality',
		description : 'Chroma quality factor (0-100)',
	},
} as const satisfies PluginOptions

const onlyfitPlugin = ( opts?: InitOptions ): Plugin<PluginOptions, typeof options> =>
	async utils => {

		return {
			data : {
				description,
				url : homepage,
			},
			optimizer : {
				options,
				mimetypes : [ utils.mime.getType( 'jpeg' ) ].filter( f => typeof f === 'string' ),

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
