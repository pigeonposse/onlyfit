import { AsyncZipOptions } from 'fflate'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

export const options =  {
	level : {
		type        : 'range',
		label       : 'Compression Level',
		value       : 6,
		description : `The level of compression to use, ranging from 0-9.

0 will store the data without compression.
1 is fastest but compresses the worst, 9 is slowest but compresses the best.
The default level is 6.

Typically, binary data benefits much more from higher values than text data.
In both cases, higher values usually take disproportionately longer than the reduction in final size that results.

For example, a 1 MB text file could:
- become 1.01 MB with level 0 in 1ms
- become 400 kB with level 1 in 10ms
- become 320 kB with level 9 in 100ms`,
		min      : 0,
		max      : 9,
		required : false,
	},
	mem : {
		type        : 'range',
		label       : 'Memory Level',
		description : `The memory level to use, ranging from 0-12. Increasing this increases speed and compression ratio at the cost of memory.

Note that this is exponential: while level 0 uses 4 kB, level 4 uses 64 kB, level 8 uses 1 MB, and level 12 uses 16 MB.
It is recommended not to lower the value below 4, since that tends to hurt performance.

In addition, values above 8 tend to help very little on most data and can even hurt performance.

The default value is automatically determined based on the size of the input data.`,
		min      : 0,
		max      : 12,
		required : false,
	},
	dictionary : {
		type        : 'string', // Could also be `array` or custom type if handling Uint8Array specially
		label       : 'Dictionary',
		description : `A buffer containing common byte sequences in the input data that can be used to significantly improve compression ratios.

Dictionaries should be 32kB or smaller and include strings or byte sequences likely to appear in the input.
The decompressor must supply the same dictionary as the compressor to extract the original data.

Dictionaries only improve aggregate compression ratio when reused across multiple small inputs. They should typically not be used otherwise.

Avoid using dictionaries with GZIP and ZIP to maximize software compatibility.`,
		required : false,
	},
} as const satisfies PluginOptions

/**
 * CSSO plugin for Onlyfit.
 *
 * @returns {Plugin} - plugin instance
 */
const onlyfitPlugin = ( ): Plugin<PluginOptions, typeof options> =>
	async () => ( { optimizer : {
		mimetypes : [ 'application/zip', 'application/zlib' ],
		options,
		fn        : async ( {
			input, options,
		} ) => {

			const { compress } = await import( './index' )

			const res = await compress( input, options as AsyncZipOptions )
			return res

		},
	} } )

export default onlyfitPlugin
