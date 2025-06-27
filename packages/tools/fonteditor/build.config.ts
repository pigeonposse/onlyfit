import { config }            from '@onlyfit/repo-config/unbuild-tool'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		...config,
		failOnWarn : false,
		// rollup     : {
		// 	...config.rollup,
		// 	inlineDependencies : [ 'fonteditor-core' ],
		// },
	},
] )
