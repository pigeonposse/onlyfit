import { copyFile }          from '@dovenv/core/utils'
import { config }            from '@onlyfit/repo-config/unbuild'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		...config,
		hooks : { 'build:done' : async () => {

			await copyFile( {
				input  : './src/core/pkg/gs.wasm',
				output : './dist/gs.wasm',
			} )

		} },
	},
] )
