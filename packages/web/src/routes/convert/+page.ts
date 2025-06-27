
import type { MetaTags }       from '@svaio/meta/svelte'
import type { ComponentProps } from 'svelte'

import { userState } from '$appstate'

const routes = userState.conversion.routes.value

export const entries = () => routes.map( ( { slug } ) => ( { slug } ) )

export const load = ( { params } ) => {

	const slug      = params.slug
	const routeData = routes.find( route => route.slug === slug )

	if ( !routeData?.slug || routeData?.slug !== slug )
		throw new Error( 'Page not exists' )

	const text = `Supported extensions: ${routeData.data.extensions.join( ', ' )}. Supported mimetypes: ${routeData.data.mimeTypes.join( ', ' )}.`

	const meta: ComponentProps<typeof MetaTags> = {
		title       : `${slug.toUpperCase()} Compression | ${PKG.extra.productName}`,
		description : `Optimize and compress your ${slug} files easily and client-side. ${text}`,
	}

	userState.compression.allowedTypes = new Set( routeData.data.mimeTypes )

	return {
		routeData,
		meta,
	}

}

