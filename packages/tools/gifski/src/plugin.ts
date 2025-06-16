import {
	description,
	homepage,
} from '../package.json'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = {
	pdfSettings : {
		type        : 'select',
		value       : '/ebook',
		required    : false,
		label       : 'PDF Settings',
		description : 'Compression level based on quality/DPI',
		options     : [
			{
				value : '/default',
				label : 'Default (balanced)',
			},
			{
				value : '/screen',
				label : 'Screen (72 DPI, lowest quality)',
			},
			{
				value : '/ebook',
				label : 'eBook (150 DPI, recommended)',
			},
			{
				value : '/printer',
				label : 'Printer (300 DPI, highest quality)',
			},
			{
				value : '/prepress',
				label : 'Prepress (300 DPI, highest quality)',
			},
			{
				value : '/smallest',
				label : 'Smallest size (variable DPI)',
			},
		],
	},
	customFlags : {
		type        : 'array',
		value       : [],
		required    : false,
		label       : 'Custom flags',
		description : 'Custom flags for ghostscript',
	},
} satisfies PluginOptions

const onlyfitPlugin = ( opts?: { wasmPath?: string } ): Plugin<PluginOptions, typeof options> => async utils => {

	const ghostscript = async () => {

		return !utils.env.isBrowser
			? await import( '@onlyfit/ghostscript' )
			: await import( '@onlyfit/ghostscript/browser' )

	}

	return {
		data : {
			description,
			homepage,
		},
		converter : {
			options,
			mimetypes : [ ...utils.mime.getAllExtensions( 'pdf' ) || [] ],

			fn : async ( {
				input, from, to, options,
			} ) => {

				const {
					compress, init,
				} = await ghostscript()
				if ( opts?.wasmPath ) await init( opts.wasmPath )

				const ext   = utils.mime.getExtension( from )
				const toExt = utils.mime.getExtension( to )
				if ( !ext ) throw new Error( 'Unsupported format in input' )
				if ( !toExt ) throw new Error( 'Unsupported format in output' )

				const cv = await compress( input, options )
				return cv

			},
		},
	}

}
export default onlyfitPlugin
