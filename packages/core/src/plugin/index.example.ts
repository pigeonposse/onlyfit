import {
	definePlugin,
	Plugin,
} from '.'
import { PluginOptions } from './options'

const options = {
	compatibility : {
		required    : true,
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
		type        : 'string',
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
} as const satisfies PluginOptions

// type T = OptionsInfer<typeof options>

export const cleanCssPlugin: Plugin<PluginOptions, typeof options> = utils => ( {
	id        : 'clean-css',
	optimizer : {
		mimetypes : [ 'text/css' ],
		options   : options,
		fn        : async ( {
			input, options,
		} ) => {

			console.log( options, input, options.level, options.rebaseTo, options.sourceMapInlineSources )
			return utils.convert.string2arrayBuffer( 'res' )

		},
	},
} )

export const myPlugin = definePlugin( () => ( {
	id   : 'my-example-plugin',
	data : {
		name        : 'Example Converter and Optimizer',
		version     : '1.0.0',
		description : 'Converts and optimizes sample files',
		url         : 'https://example.com/plugin',
	},
	converter : {
		mimetypes : [ 'text/plain', 'application/json' ],
		options   : { prettyPrint : {
			type     : 'boolean',
			label    : 'Pretty print output',
			value    : true,
			required : false,
		} },
		fn : async ( {
			input, options,
		} ) => {

			const text = new TextDecoder().decode( input )

			const result = options?.prettyPrint
				? JSON.stringify( JSON.parse( text ), null, 2 )
				: text

			return new TextEncoder().encode( result )

		},
	},
	optimizer : {
		mimetypes : [ 'application/json' ],
		options   : { removeWhitespace : {
			type     : 'boolean',
			label    : 'Remove all whitespace',
			value    : false,
			required : false,
		} },
		fn : async ( {
			input, options,
		} ) => {

			const json      = new TextDecoder().decode( input )
			const optimized = options?.removeWhitespace
				? JSON.stringify( JSON.parse( json ) )
				: json

			return new TextEncoder().encode( optimized )

		},
	},
} ) )
