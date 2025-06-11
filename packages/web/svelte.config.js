import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess : {},
	kit        : {
		adapter : adapter( {
			strict      : true,
			precompress : true,
			fallback    : '202.html',
		} ),
		alias : {
			$utils      : './src/lib/utils',
			$components : './src/lib/components',
			$appstate   : './src/lib/state/index.svelte.ts',
		},
	},
}

export default config
