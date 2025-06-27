import {
	allUtils,
	type MimeType,
} from '@onlyfit/core'

import {
	allSupportedTypes,
	groupMimeTypes,
	// imageMineTypes,
	SUPPORTED_EXTENSIONS_MAP,
} from './mimetypes'

import type { RouteDataShared } from '../_shared'

type RouteData = RouteDataShared<'compress'> & { data: {
	/**
	 * Indicates if the route is a group of mime types
	 */
	isGroup?     : boolean
	/**
	 * group of extension
	 */
	group?       : string
	/** if is a featured slug */
	isFeatured?  : boolean
	/** if is extension slug */
	isExtension? : boolean
	/** Supported extensions */
	extensions   : string[]
	/** Supported mime types */
	mimeTypes    : MimeType[]
} }

const getRoute           = ( key: string ) => `/compress/${key}`
const route: RouteData[] = []

const IMAGE_SPECIFIC_EXT = {
	jpeg : 'jpeg',
	jpg  : 'jpg',
	png  : 'png',
	webp : 'webp',
	gif  : 'gif',
	svg  : 'svg',
	pdf  : 'pdf',
	zip  : 'zip',
} as const

SUPPORTED_EXTENSIONS_MAP.forEach( ( exts, group ) => exts.forEach( key => route.push( {
	slug  : key,
	key   : key,
	type  : 'compress',
	route : getRoute( key ),
	data  : {
		isExtension : true,
		group,
		isFeatured  : IMAGE_SPECIFIC_EXT[key as keyof typeof IMAGE_SPECIFIC_EXT] !== undefined,
		extensions  : [ key ],
		mimeTypes   : Array.from( allUtils.mime.getAllTypes( key ) || [] ),
	},
} ) ) )
Object.keys( groupMimeTypes ).forEach( key => route.push( {
	slug  : key,
	key   : key,
	type  : 'compress',
	route : getRoute( key ),
	data  : {
		isGroup    : true,
		extensions : Array.from( allUtils.mime.getAllExtensions( groupMimeTypes[key] ) || [] ),
		mimeTypes  : groupMimeTypes[key],
	},
} ) )

export const ROUTES_DATA = route
export const ALLOWED_TYPES_ALL = [ ...allSupportedTypes ]

