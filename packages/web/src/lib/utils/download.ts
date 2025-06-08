import { getUUID } from './string'

export type DownloadInput = Blob | File
export type DownloadConfig = { prefix?: string }

const download = ( output: DownloadInput, name: string ) => {

	const url = URL.createObjectURL( output )
	const a   = document.createElement( 'a' )
	a.href    = url

	a.download = name
	document.body.appendChild( a )
	a.click()
	document.body.removeChild( a )
	URL.revokeObjectURL( url )

}

export class Download {

	config

	constructor( config?: DownloadConfig ) {

		this.config = config

	}

	#getName( prefix?: string, sufix?: string ) {

		return ( prefix ? ( prefix + '-' ) : '' ) + getUUID() + ( sufix ? ( '-' + sufix ) : '' )

	}

	async run( input?: DownloadInput, name?: string ) {

		if ( !input ) throw new Error( 'Input must exist' )
		await download( input, name || this.#getName( this.config?.prefix ) )

	}

}
