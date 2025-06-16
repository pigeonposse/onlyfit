import {
	PluginOptions,
	PluginOptionsInfer,
	PluginOptionsValue,
} from './options'
import { MimeType }    from '../utils'
import { allUtils }    from '../utils'
import { PackageJSON } from '../utils/types'

export type {
	PluginOptions,
	PluginOptionsInfer,
	PluginOptionsValue,
}

export type PluginData<C extends PluginOptions | undefined = undefined, O extends PluginOptions | undefined = undefined> = {

	/**
	 * Plugin darta information
	 */
	data?: {
		/**
		 * Plugin visible name
		 */
		name?        : string
		version?     : string
		description? : string
		url?         : string
		pkg?         : PackageJSON
		// IS NOT NECESSARY cause can be detected by mimetype
		// type?    : 'audio' | 'css' | 'docs' | 'font' | 'html' | 'image' | 'pdf'  | 'video' | 'other'
	}

	/**
	 * Conversion function
	 */
	converter? : {
		/** Input mimetypes supported */
		mimetypes : MimeType[]
		/**
		 * Options to be visible in the UI
		 */
		options?  : C
		fn        : ( data:{
			input   : ArrayBuffer
			from    : MimeType
			to      : MimeType
			/** Represents user options */
			options : C extends PluginOptions ? PluginOptionsInfer<C> : undefined
		} ) => Promise<ArrayBuffer>
	}

	/**
	 * Optimizer function
	 */
	optimizer?      : {
		/** Input mimetypes supported */
		mimetypes : MimeType[]
		/**
		 * Options to be visible in the UI
		 */
		options?  : O
		fn        : ( data: {
			input   : ArrayBuffer/** Represents user options */
			options : O extends PluginOptions ? PluginOptionsInfer<O> : undefined
		} ) => Promise<ArrayBuffer>
	}

	/**
	 * Supported environment
	 * IS NOT NECESSARY cause you can: window !== 'undefined' && typeof window.document !== 'undefined' in your code plugin
	 */
	// environment?: ('node' | 'browser' | 'deno' |  'bun')[]
	/**
	 * Initialization function
	 * IS NOT NECESSARY
	 */
	// init?      : {
	// 	options? : Options
	// 	fn       : () => Promise<void>
	// }
}

export type Plugin<
	C extends PluginOptions = PluginOptions,
	O extends PluginOptions = PluginOptions,
> = (
	data: typeof allUtils
) => ( Promise<PluginData<C, O>> | PluginData<C, O> )

// export const definePlugin = <C extends Options, O extends Options>( plugin: P ) => plugin
export const definePlugin = <
	C extends PluginOptions,
	O extends PluginOptions,
>(
	plugin: Plugin<C, O>,
) => plugin
