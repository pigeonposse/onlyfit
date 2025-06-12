import {
	ALLOWED_TYPES,
	COMPRESS_ID,
} from '../../const'

import type { MetaTags }       from '@svaio/meta/svelte'
import type { ComponentProps } from 'svelte'

import { userState } from '$appstate'

export const entries = () =>
	COMPRESS_ID.map( type => ( { slug: type } ) )

export const load = ( { params } ) => {

	const slug = params.slug as typeof COMPRESS_ID[number]
	if ( !COMPRESS_ID.includes( slug ) )
		throw new Error( 'Page not exists' )

	const meta: ComponentProps<typeof MetaTags> = {
		title       : `${slug.toUpperCase()} Compression | ${PKG.extra.productName}`,
		description : `Optimize and compress your ${slug} files easily and client-side.`,
	}

	userState.compression.allowedTypes = new Set( ALLOWED_TYPES[slug] )

	return {
		type : slug,
		meta,
	}

}

