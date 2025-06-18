import {
	PluginOptions,
	PluginOptionsInfer,
	PluginOptionsValue,
} from './options'
import { MimeType } from '../utils'
import { allUtils } from '../utils'
import {
	PackageJSON,
	Prettify,
} from '../utils/types'

export type {
	PluginOptions,
	PluginOptionsInfer,
	PluginOptionsValue,
}
export type PluginInfo = {
	/**
	 * Visible name
	 */
	name?        : string
	/**
	 * Description
	 */
	description? : string
	/**
	 * URL of homepage or repository
	 */
	url?         : string
	/**
	 * Information about the package
	 */
	package?     : PackageJSON
}
export type PluginData<C extends PluginOptions | undefined = undefined, O extends PluginOptions | undefined = undefined> = {

	/**
	 * Plugin data information
	 */
	data? : PluginInfo & { mentions?: PluginInfo[] }

	/**
	 * Conversion function
	 */
	converter? : {
		/** Input mimetypes supported */
		mimetypes : MimeType[] | {
			from : MimeType[]
			to   : MimeType[]
		}[]
		/**
		 * Options to be visible in the UI
		 */
		options? : C
		fn        : ( data:{
			input   : ArrayBuffer
			from    : MimeType
			to      : MimeType
			/** Represents user options */
			options : C extends PluginOptions ? Prettify<PluginOptionsInfer<C>> : undefined
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
			options : O extends PluginOptions ? Prettify<PluginOptionsInfer<O>> : undefined
			type    : MimeType
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
