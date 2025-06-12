export const COMPRESS_IDS = {
	audio : 'audio',

	image : 'image',
	jpeg  : 'jpeg',
	jpg   : 'jpg',
	png   : 'png',
	webp  : 'webp',
	gif   : 'gif',

	svg : 'svg',

	pdf : 'pdf',

	zip : 'zip',

	video : 'video',
} as const
export const COMPRESS_ID = Object.values( COMPRESS_IDS )

export const ALLOWED_OTHER_TYPES = [
	// Documents
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/vnd.oasis.opendocument.text',
	'application/vnd.oasis.opendocument.spreadsheet',
	'application/vnd.oasis.opendocument.presentation',

	// Others
	'text/html',
	'text/plain',
	'application/json',
	'application/xml',
	'text/css',
	'application/javascript',
	'text/javascript',
]
export const ALLOWED_TYPES: Record<typeof COMPRESS_ID[number], string[]> = {
	audio : [
		'audio/mpeg',
		'audio/wav',
		'audio/ogg',
		'audio/mp4',
		'audio/aac',
		'audio/flac',
		'audio/x-ms-wma',
		'audio/x-aiff',
	],
	image : [
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/webp',
		'image/tiff',
		'image/bmp',
		'image/svg+xml',
	],
	jpeg  : [ 'image/jpeg' ],
	jpg   : [ 'image/jpeg' ],
	png   : [ 'image/png' ],
	webp  : [ 'image/webp' ],
	gif   : [ 'image/gif' ],
	svg   : [ 'image/svg+xml' ],
	pdf   : [ 'application/pdf' ],
	zip   : [ 'application/zip' ],
	video : [
		'video/mp4',
		'video/quicktime',
		'video/x-msvideo',
		'video/x-matroska',
		'video/x-ms-wmv',
		'video/webm',
		'video/x-flv',
		'video/mp2t',
		'video/3gpp',
		'video/mpeg',
	],
}
export const ALLOWED_TYPES_ALL = [ ...Object.values( ALLOWED_TYPES ).flat(), ...ALLOWED_OTHER_TYPES ]

export const ROUTES = [ ...COMPRESS_ID.map( route => `/compress/${route}` ) ]
