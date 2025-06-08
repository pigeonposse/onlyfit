import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess : {},
	kit        : {
		adapter : adapter( ),
		alias   : {
			$utils      : './src/lib/utils',
			$components : './src/lib/components',
			$appstate   : './src/lib/state/index.svelte.ts',
		},
	},
}

export default config
