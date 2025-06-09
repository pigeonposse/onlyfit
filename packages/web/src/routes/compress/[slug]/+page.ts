const COMPRESS_TYPES = {
	audio : 'audio',
	image : 'image',
	pdf   : 'pdf',
	svg   : 'svg',
	zip   : 'zip',
	video : 'video',
}
const COMPRESS_TYPE  = Object.keys( COMPRESS_TYPES )

export const load = ( { params } ) => {

	if ( !COMPRESS_TYPE.includes( params.slug ) ) throw new Error( 'Page not exists' )
	return { type: COMPRESS_TYPE }

}
