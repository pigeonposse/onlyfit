// export const prerender = true

import type { Seo }            from '@svaio/meta/svelte'
import type { ComponentProps } from 'svelte'

import { joinURL } from '$utils'

type SeoProps = ComponentProps<typeof Seo>
// export const ssr = false
export const prerender = 'auto'
export const load = () => {

	const metaAll: SeoProps['meta']               = {
		title       : `${PKG.extra.productName} - ${PKG.extra.shortDesc}`,
		description : PKG.extra.action,
	}
	const meta: SeoProps['meta']                  = {}
	const jsonld: NonNullable<SeoProps['jsonld']> = {
		output : 'head',
		/** @see https://validator.schema.org/ */
		schema : {
			'@context'            : 'http://schema.org',
			'@type'               : [ 'WebApplication' ],
			'name'                : metaAll.title,
			'description'         : PKG.extra.shortDesc + ' ' + metaAll.description,
			'url'                 : PKG.homepage,
			'applicationCategory' : 'UtilitiesApplication',
			'softwareVersion'     : APP_PKG.version,
			'keywords'            : PKG.keywords,
			'featureList'         : [
				'Audio Compression',
				'Image Compression and Optimization (JPEG, JPG, PNG, WebP, GIF)',
				'SVG Optimization',
				'PDF Compression',
				'ZIP File Compression',
				'Video Compression',
				'Support for multiple file formats',
				'Intuitive user interface',
				'Offline functionality (PWA)',
				'Specific routes for file type compression',
				'Completely Free',
				'Open Source',
			],
			'publisher' : {
				'@type' : 'Organization',
				'logo'  : joinURL( PKG.extra.collective.gh + '.png' ),
				'email' : PKG.extra.collective.email,
				'name'  : PKG.extra.collective.name,
				'url'   : PKG.extra.collective.url,
			},
			'license' : PKG.extra.licenseURL,
			// 'codeRepository' : PKG.repository.url,
		},
	}
	return {
		metaAll,
		meta,
		jsonld,
	}

}
