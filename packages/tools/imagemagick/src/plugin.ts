import {
	description,
	homepage,
} from '../package.json'
import  {
	type InitCoreOptions,
	MagickFormat,
} from './index'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = {
	width : {
		type        : 'number',
		label       : 'Image width',
		value       : 0,
		description : 'Width in pixels',
		required    : false,
	},
	height : {
		type        : 'number',
		label       : 'Image height',
		value       : 0,
		description : 'Height in pixels',
		required    : false,
	},
	quality : {
		type        : 'range',
		label       : 'Image quality',
		min         : 0,
		max         : 100,
		value       : 75,
		description : 'Quality level from 0 to 100',
		required    : false,
	},
	// format : {
	// 	type    : 'selectString',
	// 	label   : 'Output format',
	// 	value   : 'Jpeg',
	// 	options : [
	// 		{
	// 			label : 'JPEG',
	// 			value : 'Jpeg',
	// 		},
	// 		{
	// 			label : 'PNG',
	// 			value : 'Png',
	// 		},
	// 		{
	// 			label : 'WebP',
	// 			value : 'WebP',
	// 		},
	// 		{
	// 			label : 'AVIF',
	// 			value : 'Avif',
	// 		},
	// 		{
	// 			label : 'TIFF',
	// 			value : 'Tiff',
	// 		},
	// 		{
	// 			label : 'GIF',
	// 			value : 'Gif',
	// 		},
	// 	],
	// 	description : 'Output image format',
	// 	required    : false,
	// },
} as const satisfies PluginOptions

const onlyfitPlugin = ( opts?: InitCoreOptions ): Plugin<PluginOptions, typeof options> =>
	async utils => {

		const data = Object.values( MagickFormat )
			.map( f => {

				const type = utils.mime.getType( f ) // is not neccesary: || utils.mime.getType( f.toLowerCase() )
				if ( !type ) return undefined
				return {
					mimetype : type,
					value    : f,
				}

			} )
			.filter( f => f !== undefined )

		return {
			data : {
				description,
				homepage,
			},
			init : async () => {

				if ( !opts ) return

				const { init } = await import( './index' )
				await init( opts )

			},
			optimizer : {
				options,
				mimetypes : data.map( f => f.mimetype ),

				fn : async ( {
					input, options, type,
				} ) => {

					const { optimize } = await import( './index' )

					const format = ( data.find( f => f.mimetype === type )?.value )
					if ( !format ) throw new Error( `Unsupported (to) format for mimetype "${type}"` )

					return await optimize( input, {
						...options,
						format,
					} )

				},
			},
			converter : {
				mimetypes : data.map( f => f.mimetype ),
				fn        : async ( {
					input, to,
				} ) => {

					const { convert } = await import( './index' )

					const format = ( data.find( f => f.mimetype === to )?.value )
					if ( !format ) throw new Error( `Unsupported (to) format for mimetype "${to}"` )

					return await convert( input, format )

				},
			},
		}

	}

export default onlyfitPlugin
