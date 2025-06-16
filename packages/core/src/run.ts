import { Plugin } from './plugin'
import {
	allUtils,
	type MimeType,
} from './utils'

export type CoreOptions<K extends string = string> = {
	debug? : boolean
	plugin : Record<K, Plugin>
}

export class Core<Keys extends string = string> {

	plugins : Map<Keys, Plugin> = new Map()
	utils   : typeof allUtils = allUtils

	constructor( opts: CoreOptions<Keys> ) {

		if ( !opts.debug ) console.debug = () => {}

		for ( const key in opts.plugin )
			this.plugins.set( key, opts.plugin[key] )

	}

	async getData<K extends Keys>( type: K ) {

		const plugin = this.plugins.get( type )
		if ( !plugin ) throw new Error( `Plugin "${type}" not exists` )

		return await plugin( this.utils )

	}

	getExtensions( mimetypes? :MimeType[] | MimeType ) {

		if ( !mimetypes ) return undefined
		if ( !Array.isArray( mimetypes ) ) mimetypes = [ mimetypes ]

		const exts = new Set<string>()

		for ( const mimetype of mimetypes ) {

			const extSet = this.utils.mime.getAllExtensions( mimetype )
			extSet?.forEach( ext => exts.add( ext ) )

		}
		const extsArray = Array.from( exts )
		return extsArray

	}

	async get<K extends Keys>( type: K ) {

		const data = await this.getData( type )

		return {
			data                     : data,
			convertedValidExtensions : this.getExtensions( data.converter?.mimetypes ),
			optimizedValidExtensions : this.getExtensions( data.optimizer?.mimetypes ),
			converter                : !data.converter?.fn
				? undefined
				: async ( d: Parameters<typeof data.converter.fn>[0] ) => {

					const { from }  = d
					const minetypes = new Set( data.converter!.mimetypes )

					if ( !minetypes.has( from ) ) throw new Error( `Mimetypes not supported` )
					return data.converter!.fn( d )

				},
			optimizer : !data.optimizer?.fn
				? undefined
				: async ( d: Parameters<typeof data.optimizer.fn>[0] & { type: string } ) => {

					const { type }  = d
					const minetypes = new Set( data.optimizer!.mimetypes )

					if ( !minetypes.has( type ) ) throw new Error( `Mimetypes not supported` )
					return data.optimizer!.fn( d )

				},
		}

	}

}
