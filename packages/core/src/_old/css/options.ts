import type { Options } from '../_shared/options'

export const csso = {
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
		type        : 'text',
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
} satisfies Options

export const cleancss = {
	compatibility : {
		value       : '*',
		type        : 'select',
		label       : 'Compatibility mode',
		description : 'Controls compatibility mode. Default: * (ie10+)',
		options     : [
			{
				value : '*',
				label : 'IE10+',
			},
			{
				value : 'ie9',
				label : 'IE9',
			},
			{
				value : 'ie8',
				label : 'IE8',
			},
			{
				value : 'ie7',
				label : 'IE7',
			},
		],
	},
	// fetch : {
	// 	value       : null,
	// 	type        : 'function',
	// 	label       : 'Fetch function',
	// 	description : 'Custom function to handle remote @import requests',
	// },
	format : {
		value       : false,
		type        : 'select',
		label       : 'Output format',
		description : 'Controls CSS formatting output',
		options     : [
			{
				value : false,
				label : 'None (minified)',
			},
			{
				value : 'beautify',
				label : 'Beautify',
			},
			{
				value : 'keep-breaks',
				label : 'Keep line breaks',
			},
		],
	},
	// inline : {
	// 	value       : [ 'local' ],
	// 	type        : 'array',
	// 	label       : 'Inline @import rules',
	// 	description : 'Whitelist for @import processing: local, remote, none, all, [uri], ![uri]',
	// },
	// inlineRequest : {
	// 	value       : null,
	// 	type        : 'object',
	// 	label       : 'Inline request options',
	// 	description : 'Options for inlining remote @import rules',
	// },
	// inlineTimeout : {
	// 	value       : 5000,
	// 	type        : 'number',
	// 	label       : 'Inline timeout (ms)',
	// 	description : 'Timeout in milliseconds for remote @import. Default: 5000',
	// },
	level : {
		value       : 1,
		type        : 'select',
		label       : 'Optimization level',
		description : 'Optimization level: 0 (none), 1 (basic), 2 (advanced)',
		options     : [
			{
				value : 0,
				label : 'Level 0 (no optimization)',
			},
			{
				value : 1,
				label : 'Level 1 (default)',
			},
			{
				value : 2,
				label : 'Level 2 (advanced)',
			},
		],
	},
	rebase : {
		value       : true,
		type        : 'boolean',
		label       : 'Rebase URLs',
		description : 'Enable or disable URL rebasing. Default: true',
	},
	rebaseTo : {
		value       : '',
		type        : 'text',
		label       : 'Rebase to directory',
		description : 'Directory to which all URLs are rebased',
	},
	sourceMap : {
		value       : false,
		type        : 'boolean',
		label       : 'Generate source map',
		description : 'Whether to build a source map. Default: false',
	},
	sourceMapInlineSources : {
		value       : false,
		type        : 'boolean',
		label       : 'Inline sources in source map',
		description : 'Embed sources inside source map. Default: false',
	},
} satisfies Options

export const lightningcss = { minify : {
	value       : true,
	type        : 'boolean',
	label       : 'Minify',
	description : 'Enable or disable minification.',
} } satisfies Options
