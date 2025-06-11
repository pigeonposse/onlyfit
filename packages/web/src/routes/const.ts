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
}
export const COMPRESS_ID = Object.values( COMPRESS_IDS )
export const ROUTES = [ ...COMPRESS_ID.map( route => `/compress/${route}` ) ]
