import adapterCloudflare from '@sveltejs/adapter-cloudflare'
import adapter           from '@sveltejs/adapter-static'

const isCloudflare = process.env.CLOUDFLARE

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess : {},
	kit        : {
		adapter : isCloudflare
			? adapterCloudflare()
			: adapter( {
				strict   : true,
				fallback : '202.html',
			} ),
		alias : {
			$utils      : './src/lib/utils',
			$icons      : './src/lib/icon',
			$worker     : './src/lib/worker',
			$core       : './src/lib/core',
			$components : './src/lib/components',
			$ui         : './src/lib/ui',
			$appstate   : './src/lib/state/index.svelte.ts',
		},
	},
}

export default config
