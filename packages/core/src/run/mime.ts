import {
	mime,
	MimeType,
} from '../utils'

const expandMimeCombinations = ( entry: {
	from : MimeType[]
	to   : MimeType[]
} ) => {

	const result: {
		from : MimeType
		to   : MimeType
	}[] = []

	for ( const from of entry.from )
		for ( const to of entry.to ) {

			if ( from === to ) continue
			result.push( {
				from,
				to,
			} )

		}

	return result

}
export const getMimetypeData = ( mimetypes: MimeType[] | {
	from : MimeType[]
	to   : MimeType[]
}[] ) => {

	const fromSet         = new Set<MimeType>()
	const toSet           = new Set<MimeType>()
	const allSet          = new Set<MimeType>()
	const combinations    = new Set<{
		from : MimeType
		to   : MimeType
	}>()
	const stringMimetypes = new Set<MimeType>()
	const objectMimetypes = new Set<{
		from : MimeType[]
		to   : MimeType[]
	}>()

	mimetypes.forEach( m => {

		if ( typeof m === 'string' ) stringMimetypes.add( m )
		else objectMimetypes.add( m )

	} )

	objectMimetypes.add( {
		from : Array.from( stringMimetypes ),
		to   : Array.from( stringMimetypes ),
	} )

	objectMimetypes.forEach( entry => {

		expandMimeCombinations( entry )
			.forEach( v => combinations.add( v ) )

		entry.from.forEach( f => {

			fromSet.add( f )
			allSet.add( f )

		} )
		entry.to.forEach( t => {

			toSet.add( t )
			allSet.add( t )

		} )

	} )
	const data = {
		combinations : Array.from( combinations ),
		/**
		 * All mimetypes in a array
		 */
		format       : Array.from( objectMimetypes ),
		/**
		 * All mimetypes from 'from' option
		 */
		from         : Array.from( fromSet ),
		/**
		 * All mimetypes from 'to' option
		 */
		to           : Array.from( toSet ),
		/**
		 * All mimetypes from 'from' and 'to' option
		 */
		all          : Array.from( allSet ),
	}
	return {
		...data,
		extensions : {
			combinations : data.combinations.map( c => ( {
				from : mime.getExtension( c.from ) as string,
				to   : mime.getExtension( c.to ) as string,
			} ) ),
			format : data.all.map( c => ( mime.getExtension( c ) ) ).filter( c => typeof c === 'string' ),
			to     : data.to.map( c => ( mime.getExtension( c ) ) ).filter( c => typeof c === 'string' ),
			from   : data.from.map( c => ( mime.getExtension( c ) ) ).filter( c => typeof c === 'string' ),
			all    : data.all.map( c => ( mime.getExtension( c ) ) ).filter( c => typeof c === 'string' ),
		},
	}

}

