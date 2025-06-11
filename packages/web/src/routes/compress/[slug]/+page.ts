import { COMPRESS_ID } from '../../const'

import type { MetaTags }       from '@svaio/meta/svelte'
import type { ComponentProps } from 'svelte'

export const entries = () =>
	COMPRESS_ID.map( type => ( { slug: type } ) )

export const load = ( { params } ) => {

	if ( !COMPRESS_ID.includes( params.slug ) ) throw new Error( 'Page not exists' )
	const meta: ComponentProps<typeof MetaTags> = {
		title       : `${params.slug.toUpperCase()} Compression | ${PKG.extra.productName}`,
		description : `Optimize and compress your ${params.slug} files easily and client-side.`,
	}
	return {
		type : params.slug,
		meta,
	}

}

