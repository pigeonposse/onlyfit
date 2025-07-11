
/** @type {import('unbuild').BuildConfig} */
export const config = {
	sourcemap   : false,
	declaration : true,
	rollup      : {
		inlineDependencies : false,
		emitCJS            : false,
		esbuild            : {
			minify : true,
			target : 'node20',
		},
	},
	failOnWarn : true,
}
