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
	target_size : {
		type        : 'number',
		label       : 'Target Size',
		description : 'Desired output size in bytes (0 = disabled)',
	},
	target_PSNR : {
		type        : 'number',
		label       : 'Target PSNR',
		description : 'Desired peak signal-to-noise ratio',
	},
	method : {
		type        : 'number',
		label       : 'Method',
		description : 'Compression effort (0=fast, 6=slowest)',
	},
	sns_strength : {
		type        : 'number',
		label       : 'SNS Strength',
		description : 'Spatial Noise Shaping strength',
	},
	filter_strength : {
		type        : 'number',
		label       : 'Filter Strength',
		description : 'Strength of the deblocking filter',
	},
	filter_sharpness : {
		type        : 'number',
		label       : 'Filter Sharpness',
		description : 'Sharpness of the deblocking filter',
	},
	filter_type : {
		type        : 'number',
		label       : 'Filter Type',
		description : 'Deblocking filter type',
	},
	partitions : {
		type        : 'number',
		label       : 'Partitions',
		description : 'Number of image partitions',
	},
	segments : {
		type        : 'number',
		label       : 'Segments',
		description : 'Number of segments to use',
	},
	pass : {
		type        : 'number',
		label       : 'Passes',
		description : 'Number of entropy analysis passes',
	},
	show_compressed : {
		type        : 'number',
		label       : 'Show Compressed',
		description : 'If set, outputs compressed image size only',
	},
	preprocessing : {
		type        : 'number',
		label       : 'Preprocessing',
		description : 'Image preprocessing type',
	},
	autofilter : {
		type        : 'number',
		label       : 'Autofilter',
		description : 'Whether to automatically adjust filter strength',
	},
	partition_limit : {
		type        : 'number',
		label       : 'Partition Limit',
		description : 'Limit quality degradation in partitions',
	},
	alpha_compression : {
		type        : 'number',
		label       : 'Alpha Compression',
		description : 'Whether to compress the alpha channel',
	},
	alpha_filtering : {
		type        : 'number',
		label       : 'Alpha Filtering',
		description : 'Filter method for alpha channel',
	},
	alpha_quality : {
		type        : 'range',
		min         : 0,
		max         : 100,
		label       : 'Alpha Quality',
		description : 'Alpha channel quality (0-100)',
	},
	lossless : {
		type        : 'number',
		label       : 'Lossless',
		description : 'Enable lossless compression',
	},
	exact : {
		type        : 'number',
		label       : 'Exact',
		description : 'Preserve RGB values under transparent pixels',
	},
	image_hint : {
		type        : 'number',
		label       : 'Image Hint',
		description : 'Image type hint (photo, picture, graph)',
	},
	emulate_jpeg_size : {
		type        : 'number',
		label       : 'Emulate JPEG Size',
		description : 'Adjust quality to approximate JPEG size',
	},
	thread_level : {
		type        : 'number',
		label       : 'Thread Level',
		description : 'Enable multi-threading',
	},
	low_memory : {
		type        : 'number',
		label       : 'Low Memory',
		description : 'Reduce memory usage',
	},
	near_lossless : {
		type        : 'number',
		label       : 'Near Lossless',
		description : 'Near-lossless compression factor',
	},
	use_delta_palette : {
		type        : 'number',
		label       : 'Use Delta Palette',
		description : 'Enable delta palette compression',
	},
	use_sharp_yuv : {
		type        : 'number',
		label       : 'Use Sharp YUV',
		description : 'Use sharp YUV conversion',
	},
} as const satisfies PluginOptions

const onlyfitPlugin = ( opts?: InitOptions ): Plugin<PluginOptions, typeof options> =>
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
				mimetypes : [ utils.mime.getType( 'webp' ) ].filter( f => typeof f === 'string' ),

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
