import { defineConfig } from '@dovenv/core'
import {
	pigeonposseMonorepoTheme,
	getWorkspaceConfig,
} from '@dovenv/theme-pigeonposse'

export default defineConfig(
	pigeonposseMonorepoTheme( {
		core : await getWorkspaceConfig( {
			metaURL  : import.meta.url,
			path     : '../',
			corePath : './packages/web',
		} ),
		docs : {
			vitepress : {
				ignoreDeadLinks : true,
				themeConfig     : { outline: { level: [ 2, 3 ] } },
				metaChunk       : true,
			},
			twoslash : false,
		},
	} ),
)
