import { COMPRESS_TYPE } from '$lib/state/const'

export const load = ( { params } ) => {

	if ( !COMPRESS_TYPE.includes( params.slug ) ) throw new Error( 'Page not exists' )
	return { type: params.slug }

}
