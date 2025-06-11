/* eslint-disable camelcase */
import media                                    from '@svaio/media'
import { setDefaultMediaConfig as mediaConfig } from '@svaio/media/utils'
import pwa                                      from '@svaio/pwa'
import { setDefaultConfig as pwaConfig }        from '@svaio/pwa/utils'
import sitemap                                  from '@svaio/sitemap'
import { setDefaultConfig as sitemapConfig }    from '@svaio/sitemap/utils'
import unocss                                   from '@svaio/unocss'
import {
	presetWind3,
	transformerDirectives,
	extractorSvelte,
	presetIcons,
	getIconsFromIconifyRemotely,
} from '@svaio/unocss/utils'
import { sveltekit }    from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

import pkg from '../../package.json'

const primary   = 'rgba(19, 163, 74, 1)'
const secondary = 'rgba(151, 202, 59, 1)'
const terciary  = 'rgba(151, 202, 59, 0.3)'
const fourth    = '#f8f9fa'
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
		sitemap( sitemapConfig( { hostname: pkg.homepage } ) ),
		pwa( pwaConfig( {
			name        : pkg.extra.productName,
			description : pkg.extra.shortDesc,
			manifest    : {
				theme_color      : primary,
				background_color : fourth,
				categories       : [ 'productivity', 'utilities' ],
			},
		} ) ),
		unocss( {
			presets : [
				presetWind3(),
				presetIcons( {
					prefix          : 'i-',
					collections     : { 'fa6-solid': () => getIconsFromIconifyRemotely( { name: 'fa6-solid' } ) },
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
	],
	define : { PKG: pkg },
} )
