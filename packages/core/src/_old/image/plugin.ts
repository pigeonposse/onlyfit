
import { Plugin } from '../../plugin'

export const gifskiPlugin: Record<string, Plugin> = {
	imagemagick : {
		id        : 'imagemagick',
		data      : { version: '0.1.0' },
		converter : {
			minetypes : [
				'image/png',
				'image/avif',
				'image/jpeg',
				'image/webp',

			],
			fn : async ( {
				input, to,
			} ) => {

				// const ext         = mime.getExtension( to )
				const { convert } = await import( '@onlyfit/imagemagick' )
				return await convert( input, to )

			},
		},
		optimizer : {
			minetypes : [
				'image/png',
				'image/avif',
				'image/jpeg',
				'image/webp',
			],
			fn : async ( { input } ) => {

				const { optimize } = await import( '@onlyfit/imagemagick' )
				const res          = await optimize( input, { quality: 100 } )
				return res

			},
		},
	},
	gifsky : {
		id   : 'gifski',
		data : { version: '0.1.0' },

		// converter : async ( input, from, to ) => {

		// 	const { compress } = await import( '@onlyfit/gifski' )
		// 	const res          = await compress( input, { quality: 100 } )
		// 	return res

		// },
		optimizer : {
			minetypes : [ 'image/gif' ],
			fn        : async ( { input } ) => {

				const { compress } = await import( '@onlyfit/gifski' )
				const res          = await compress( input, { quality: 100 } )
				return res

			},
		},

	},
}
