import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = {
	compatibility : {
		value       : '*',
		type        : 'selectString',
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
		type        : 'selectNumber',
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

/**
 * Clean CSS plugin for Onlyfit.
 *
 * @returns {Plugin} - Clean CSS plugin
 */
const cleanCssPlugin = ( ): Plugin<PluginOptions, typeof options> =>
	async utils => {

		const cleancss = () => !utils.env.isBrowser
			? import( './index' )
			: import( './browser' )

		return { optimizer : {
			mimetypes : [ 'text/css' ],
			options,
			fn        : async ( {
				input, options,
			} ) => {

				const { compress } = await cleancss()
				const inputString  = utils.convert.arrayBuffer2string( input )

				const res = await compress( inputString, options )
				return utils.convert.string2arrayBuffer( res )

			},
		} }

	}

export default cleanCssPlugin
