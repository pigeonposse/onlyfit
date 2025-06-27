/* eslint-disable camelcase */

import { image2ascii } from '@ascii-kit/image'
import {
	dedent,
	removeEmptyLines,
} from '@dovenv/core/utils'
import media                                    from '@svaio/media'
import { setDefaultMediaConfig as mediaConfig } from '@svaio/media/utils'
import pwa                                      from '@svaio/pwa'
import { setDefaultConfig as pwaConfig }        from '@svaio/pwa/utils'
import sitemap                                  from '@svaio/sitemap'
import unocss                                   from '@svaio/unocss'
import {
	presetWind3,
	transformerDirectives,
	extractorSvelte,
	presetIcons,
} from '@svaio/unocss/utils'
import { sveltekit }    from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

import pkgApp            from './package.json'
import pkg               from '../../package.json'
import { getRoutesData } from './src/lib/core/onlyfit/vite'

const primary   = 'rgba(19, 163, 74, 1)'
const secondary = 'rgba(151, 202, 59, 1)'
const terciary  = 'rgba(151, 202, 59, 0.3)'
const fourth    = '#f8f9fa'

const buildDir  = 'build'
const i18n      = {
	defaultLanguage : 'en',
	languages       : [ 'en' ],
}
const ascciLogo = async () => {

	const res   = await fetch( 'https://github.com/pigeonposse.png?size=72' )
	const input = await res.arrayBuffer()
	const value = await image2ascii( input, { chars: ' -.@' } )

	return `${dedent( removeEmptyLines( value ) )}\n\nMade with ❤️ by ${pkg.extra.collective.name}\n\nWeb: ${pkg.extra.collective.url}\nProjects: ${pkg.extra.collective.gh}\nDonate: ${pkg.extra.collective.funding}`

}

export default defineConfig( {
	plugins : [
		media( {
			enhanced : true,
			create   : { value : { og : mediaConfig( {
				title : pkg.extra.productName,
				desc  : pkg.extra.shortDesc,
				text  : pkg.extra.action,
				image : 'https://github.com/pigeonposse/onlyfit/blob/main/docs/public/logo.png?raw=true',
				color : {
					primary,
					secondary,
					terciary,
					fourth,
				},
			} ) } },
		} ),
		unocss( {
			presets : [
				presetWind3(),
				presetIcons( {
					prefix          : 'i-',
					collections     : { 'fa6-solid': () => import( '@iconify-json/fa6-solid/icons.json' ).then( i => i.default ) },
					// collections     : { 'fa6-solid': () => getIconsFromIconifyRemotely( { name: 'fa6-solid' } ) },
					extraProperties : {
						'display'        : 'inline-block',
						'vertical-align' : 'middle',
					},
				} ),
			],
			content      : { pipeline: { include: [ /\.(vue|svelte|[jt]sx|vine.ts|mdx?|astro|elm|php|phtml|html)($|\?)/, 'src/**/*.{js,ts}' ] } },
			extractors   : [ extractorSvelte() ],
			transformers : [ transformerDirectives() ],

		} ),
		sveltekit(),
		pwa( pwaConfig( {
			name        : pkg.extra.productName,
			description : pkg.extra.shortDesc,
			manifest    : {
				theme_color      : primary,
				background_color : fourth,
				lang             : i18n.defaultLanguage,
				categories       : [ 'productivity', 'utilities' ],
			},
		} ) ),
		sitemap( {
			hostname      : pkg.homepage,
			outDir        : buildDir,
			dynamicRoutes : getRoutesData().map( i => i.route ),
			robots        : [
				{
					userAgent : '*',
					allow     : '/',
				},
			],
			i18n,
		} ),
	],
	server : { proxy : { '/mimetypes' : {
		target       : 'https://www.iana.org/assignments/media-types/',
		changeOrigin : true,
		secure       : false,
		rewrite      : path => path.replace( /^\/mimetypes/, '' ),
	} } },
	define : {
		PKG        : pkg,
		APP_PKG    : pkgApp,
		LOGO_ASCII : JSON.stringify( await ascciLogo( ) ),
	},
} )
