
import { core } from '../_shared/core'

import type {
	ComboExtension,
	ComboMimetype,
} from '../_shared'
import type { RouteDataShared } from '../_shared'

const id = 'convert' as const
type RouteData = RouteDataShared<typeof id> & { data: {
	/** if is a featured slug */
	isFeatured? : boolean

	/** Supported extensions */
	extensions : ComboExtension
	/** Supported mime types */
	mimeTypes  : ComboMimetype
} }

const getSlug            = ( c: ComboExtension ) => `${c.from}-${c.to}`
const getRoute           = ( key: string ) => `/${id}/${key}`
const route: RouteData[] = []

const CONVERSION_ALLOWED = ( () => {

	const mimetypes:Set<ComboMimetype> = new Set()
	const extensions                   = new Set<ComboExtension>()
	core.plugin.forEach( p => {

		if ( p.converter?.data?.combinations )
			p.converter?.data?.combinations.forEach( t => mimetypes.add( t ) )

		if ( p.converter?.data?.extensions.combinations )
			p.converter?.data?.extensions.combinations.forEach( t => extensions.add( t ) )

	} )
	return {
		mimetypes,
		extensions,
	}

} )()

CONVERSION_ALLOWED.extensions.forEach( exts => route.push( {
	slug  : getSlug( exts ),
	key   : getSlug( exts ),
	type  : id,
	route : getRoute( getSlug( exts ) ),
	data  : {
		extensions : exts,
		mimeTypes  : [ ...CONVERSION_ALLOWED.mimetypes ].find( t => t.from === exts.from && t.to === exts.to ) as ComboMimetype,
	},
} ) )

export const ROUTES_DATA = route
export { CONVERSION_ALLOWED }

