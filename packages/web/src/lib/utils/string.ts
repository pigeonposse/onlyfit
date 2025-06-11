export const getUUID = () =>
	`${PKG.extra.libraryID}-compressed-${crypto.randomUUID()}`

export const joinURL = ( ...segments: string[] ) => {

	if ( segments.length === 0 ) return ''

	const normalizedSegments = segments
		.map( segment => {

			const s = String( segment ).trim()

			if ( s.startsWith( 'http://' ) || s.startsWith( 'https://' ) ) {

				return s

			}

			return s.replace( /^\/+|\/+$/g, '' )

		} )
		.filter( s => s !== '' )

	let url = normalizedSegments[0]

	for ( let i = 1; i < normalizedSegments.length; i++ ) {

		const currentSegment = normalizedSegments[i]

		if ( url.endsWith( '/' ) || currentSegment.startsWith( '?' ) || currentSegment.startsWith( '#' ) ) {

			url += currentSegment

		}
		else {

			url += '/' + currentSegment

		}

	}

	url = url.replace( /(?<!:)\/{2,}/g, '/' )

	return url

}
