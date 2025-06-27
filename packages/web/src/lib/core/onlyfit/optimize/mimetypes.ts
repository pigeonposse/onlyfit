import { core } from '../_shared/core'

import type { MimeType } from '@onlyfit/core'

const allSupportedTypes:Set<MimeType>    = new Set()
const allSupportedExtensions:Set<string> = new Set()

core.plugin.forEach( p => {

	if ( p.optimizer?.data.all ) p.optimizer.data.all.forEach( t => allSupportedTypes.add( t ) )

	if ( p.optimizer?.data.extensions.all )
		p.optimizer.data.extensions.all.forEach( t => allSupportedExtensions.add( t ) )

} )

const groupMimeTypes = ( ( mimeSet: Set<MimeType> ) => {

	const result: Record<string, MimeType[]> = {}

	for ( const mime of mimeSet ) {

		const [ group, subtype ] = mime.split( '/' )
		if ( !subtype ) continue

		if ( !result[group] ) result[group] = []
		result[group].push( mime )

	}

	return result

} )( allSupportedTypes )

// const IMAGE_SPECIFIC_EXT = {
// 	jpeg : 'jpeg',
// 	jpg  : 'jpg',
// 	png  : 'png',
// 	webp : 'webp',
// 	gif  : 'gif',
// 	svg  : 'svg',
// 	pdf  : 'pdf',
// 	zip  : 'zip',
// } as const

// type ImageSpecificMime = typeof IMAGE_SPECIFIC_MIMES[keyof typeof IMAGE_SPECIFIC_MIMES]

// const getSpecificRoutes = ( extension: string ) => {

// 	const types           = core.utils.mime.getAllTypes( extension )
// 	const res: MimeType[] = []
// 	if ( !types ) return
// 	for ( const type of types ) allSupportedTypes.has( type ) && res.push( type )

// 	return res

// }
// const imageMineTypes = ( () => {

// 	const res: { [k in string]: MimeType[] } = {}

// 	for ( const key in IMAGE_SPECIFIC_MIMES ) {

// 		const k = IMAGE_SPECIFIC_MIMES[key as ImageSpecificMime]
// 		const v = getSpecificRoutes( k )
// 		if ( !v ) continue
// 		res[k] = v

// 	}

// 	return res

// } )()

const SUPPORTED_EXTENSIONS_MAP: Map<string, string[]> = new Map()

const SUPPORTED_MIMETYPES_MAP = new Map( Object.entries( groupMimeTypes ) )

SUPPORTED_MIMETYPES_MAP.forEach( ( mime, k ) => {

	const exts = core.utils.mime.getAllExtensions( mime )
	if ( !exts ) return

	SUPPORTED_EXTENSIONS_MAP.set( k, [ ...exts ] )

} )

export {
	SUPPORTED_MIMETYPES_MAP,
	SUPPORTED_EXTENSIONS_MAP,
	allSupportedTypes,
	allSupportedExtensions,
	groupMimeTypes,
	// imageMineTypes,
}

