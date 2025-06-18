/* eslint-disable @stylistic/object-curly-newline */
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
		type        : 'arrayString',
		required    : false,
		label       : 'Custom flags',
		description : 'Custom flags for ghostscript',
	},
} as const satisfies PluginOptions

type InitOptions = {
	/**
	 * WASM input (url or path)
	 */
	wasmInput : string
}
const onlyfitPlugin = ( opts?: InitOptions ): Plugin<PluginOptions, typeof options> => async utils => {

	const ghostscript = async () => {

		return !utils.env.isBrowser
			? await import( './index' )
			: await import( './browser' )

	}

	return {
		data : {
			description,
			homepage,
		},
		optimizer : {
			options,
			mimetypes : [ ...utils.mime.getAllTypes( 'pdf' ) || [] ],

			fn : async ( {
				input, options,
			} ) => {

				const {
					compress, init,
				} = await ghostscript()
				if ( opts?.wasmInput ) await init( opts.wasmInput )

				// const ext   = utils.mime.getExtension( from )
				// const toExt = utils.mime.getExtension( to )
				// if ( !ext ) throw new Error( 'Unsupported format in input' )
				// if ( !toExt ) throw new Error( 'Unsupported format in output' )

				const cv = await compress( input, options )
				return cv

			},
		},
	}

}
export default onlyfitPlugin
