
import pkg, {
	description,
	homepage,
} from '../package.json'
import { OptimizeOptions } from './index'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = {
	maxSizeMB : {
		type        : 'number',
		value       : 1,
		label       : 'Max Size (MB)',
		description : 'Maximum file size in megabytes.',
	},
	maxWidthOrHeight : {
		type        : 'number',
		value       : 1024,
		label       : 'Max Width or Height',
		description : 'Resize image to fit within this maximum width or height.',
	},
	maxIteration : {
		type        : 'number',
		value       : 10,
		label       : 'Max Iteration',
		description : 'Maximum number of compression iterations.',
	},
	exifOrientation : {
		type        : 'number',
		value       : 1,
		label       : 'EXIF Orientation',
		description : 'Force a specific EXIF orientation value.',
	},
	initialQuality : {
		type        : 'number',
		value       : 0.9,
		label       : 'Initial Quality',
		description : 'Initial quality setting for compression.',
	},
	alwaysKeepResolution : {
		type        : 'boolean',
		value       : false,
		label       : 'Always Keep Resolution',
		description : 'Prevent resizing even if max dimensions are set.',
	},
	preserveExif : {
		type        : 'boolean',
		value       : true,
		label       : 'Preserve EXIF',
		description : 'Keep EXIF metadata in the output file.',
	},
} as const satisfies PluginOptions

export type InitOptions = Pick<OptimizeOptions, 'useWebWorker' | 'libURL' | 'onProgress' | 'signal'>
const onlyfitPlugin = ( opts?: InitOptions ): Plugin<PluginOptions> =>
	async utils => {

		const isBrowser = utils.env.isBrowser || utils.env.isWebWorker
		if ( !isBrowser ) return {}

		const mimetypes = [ ...utils.mime.getAllTypes( 'image' ) || [] ]
		return {
			data : {
				description,
				url     : homepage,
				package : pkg,
			},
			optimizer : {
				mimetypes,
				options,
				fn : async ( {
					input, type,
				} ) => {

					const { optimize } = await import( './index' )
					return await optimize( input, type, opts )

				},
			},
		}

	}
export default onlyfitPlugin
