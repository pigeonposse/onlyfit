import { defineConfig } from '@dovenv/core'
import { writeFile }    from '@dovenv/core/utils'
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
		workspace : { custom : {
			'tools-pkg' : {
				desc : 'set required tools dependencies',
				fn   : async d => {

					const pkgs = ( await d.utils.getPkgsData() )
						.filter( p => p.packagePath.includes( 'tools' ) )

					for ( const pkg of pkgs ) {

						let changed = false
						if ( !pkg.content.devDependencies ) pkg.content.devDependencies = {}
						if ( pkg.content.dependencies?.['@onlyfit/core'] ) {

							pkg.content.dependencies['@onlyfit/core'] = undefined
							changed                                   = true

						}
						if ( !pkg.content.devDependencies['@onlyfit/core'] ) {

							pkg.content.devDependencies['@onlyfit/core'] = 'workspace:*'
							changed                                      = true

						}
						if ( !pkg.content.exports?.['./plugin'] ) {

							pkg.content.exports['./plugin'] = {
								types  : './dist/plugin.d.ts',
								import : './dist/plugin.mjs',
							}
							changed                         = true

						}
						if ( !changed ) continue
						await writeFile( pkg.packagePath, JSON.stringify( pkg.content, null, '\t' ) )

					}

				},
			},
			'tools' : {
				desc : 'show tools info',
				fn   : async d => {

					const getPackageName = pkgPath => {

						const parts = pkgPath.split( '/' )
						return parts[parts.length - 2]

					}
					const tools     = ( await d.utils.getPkgPaths() ).filter( p => p.includes( 'tools' ) )
					const toolsName = tools.map( getPackageName )

					const dependencies = Object.fromEntries(
						toolsName.map( name => [ `@onlyfit/${name}`, 'workspace:*' ] ),
					)

					// console.log( {
					// 	paths  : tools,
					// 	names  : toolsName,
					// 	number : tools.length,
					// } )

					console.log( `DEPENDENCIES (${tools.length})` )
					console.log( JSON.stringify( { dependencies }, null, 2 ) )
					// tools.map( getPackageName ).map(d => )

				},
			},
		} },
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
