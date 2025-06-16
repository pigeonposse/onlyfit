import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

export const options = {
	// Opciones para CompressOptions
	restructure : {
		value       : true,
		type        : 'boolean',
		label       : 'Enable restructure optimisations',
		description : 'Disable or enable structure optimisations',
	},
	forceMediaMerge : {
		value       : false,
		type        : 'boolean',
		label       : 'Force media merge',
		description : 'Enable merging of @media rules with the same query (unsafe)',
	},
	clone : {
		value       : false,
		type        : 'boolean',
		label       : 'Clone input AST',
		description : 'Transform a copy of input AST if true',
	},
	comments : {
		value   : true,
		type    : 'select',
		label   : 'Comments to leave',
		options : [
			{
				value : true,
				label : 'All exclamation comments',
			},
			{
				value : 'exclamation',
				label : 'All exclamation comments (string)',
			},
			{
				value : 'first-exclamation',
				label : 'First exclamation only',
			},
			{
				value : false,
				label : 'No comments',
			},
		],
		description : 'Specify what comments to leave. Default: true',
	},
	// usage : {
	// 	value       : null,
	// 	type        : 'object',
	// 	label       : 'Usage data',
	// 	description : 'Usage data for advanced optimisations (complex object).',
	// },
	// logger : {
	// 	value       : null,
	// 	type        : 'function',
	// 	label       : 'Logger function',
	// 	description : 'Function to track every step of transformation.',
	// },

	// minify
	sourceMap : {
		value       : false,
		type        : 'boolean',
		label       : 'Generate source map',
		description : 'Generate a source map when true. Default: false',
	},
	filename : {
		value       : '<unknown>',
		type        : 'string',
		label       : 'Input filename',
		description : 'Filename of input CSS for source map generation.',
	},
	debug : {
		value       : false,
		type        : 'boolean',
		label       : 'Output debug info',
		description : 'Output debug information to stderr. Default: false',
	},
	// beforeCompress : {
	// 	value       : null,
	// 	type        : 'function|array',
	// 	label       : 'Before compress callback',
	// 	description : 'Called right after parse is run.',
	// },
	// afterCompress : {
	// 	value       : null,
	// 	type        : 'function|array',
	// 	label       : 'After compress callback',
	// 	description : 'Called right after compress() is run.',
	// },
} as const satisfies PluginOptions

/**
 * CSSO plugin for Onlyfit.
 *
 * @returns {Plugin} - plugin instance
 */
const onlyfitPlugin = ( ): Plugin<PluginOptions, typeof options> =>
	async utils => ( { optimizer : {
		mimetypes : [ 'text/css' ],
		options,
		fn        : async ( {
			input, options,
		} ) => {

			const { compress } = await import( './index' )
			const inputString  = utils.convert.arrayBuffer2string( input )

			const res = await compress( inputString, options )
			return utils.convert.string2arrayBuffer( res )

		},
	} } )

export default onlyfitPlugin
