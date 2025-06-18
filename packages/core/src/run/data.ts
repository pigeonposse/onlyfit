import { Plugin }    from '../plugin'
import { MimeType }  from '../utils'
import { CoreSuper } from './super'

export class CoreData<Keys extends string> extends CoreSuper<Keys> {

	async #getData<K extends Keys>( type: K ): Promise<Awaited<ReturnType<Plugin>>> {

		const plugin = this.plugins.get( type )
		if ( !plugin ) throw new Error( `Plugin "${type}" not exists` )

		return await plugin( this.utils )

	}

	async get<K extends Keys>( type: K ) {

		const data          = await this.#getData( type )
		const validInfo     = ( m:MimeType[] ) => `Valid mimetypes: ${m.join( ', ' )}\nValid extensions: ${[ ...( this.utils.mime.getAllExtensions( m ) || [] ) ].join( ', ' )}`
		const converterData = data.converter?.mimetypes && this.getMimetypeData( data.converter.mimetypes )
		const optimizedData = {
			all        : data.optimizer?.mimetypes,
			extensions : { all: [ ...this.utils.mime.getAllExtensions( data.optimizer?.mimetypes ) || [] ] },
		}
		return {
			data      : data,
			converter : !data.converter?.fn
				? undefined
				: {
					data : converterData,
					fn   : async ( d: Parameters<typeof data.converter.fn>[0] ) => {

						const {
							from, to,
						} = d
						// const minetypes = new Set( converterData?.from || [] )

						if ( !converterData?.from.includes( from ) ) throw new Error( `Input mimetype "${from}" not supported\n${validInfo( converterData?.from || [] )}` )
						if ( !converterData?.to.includes( to ) ) throw new Error( `Output mimetype "${to}" not supported\n${validInfo( converterData?.to || [] )}` )

						return data.converter!.fn( d )

					},
				},
			optimizer : !data.optimizer?.fn
				? undefined
				: {
					data : optimizedData,
					fn   : async ( d: Parameters<typeof data.optimizer.fn>[0] ) => {

						const { type }  = d
						const minetypes = new Set( data.optimizer!.mimetypes )

						if ( !minetypes.has( type ) ) throw new Error( `Input mimetype "${type}" not supported.\n${validInfo( data.optimizer!.mimetypes )}` )
						return data.optimizer!.fn( d )

					},
				},
		}

	}

	async getAll() {

		const data = new Map<Keys, Awaited<ReturnType<CoreData<Keys>['get']>>>()
		for ( const key of this.plugins.keys() )
			data.set( key, await this.get( key ) )

		return data

	}

}
