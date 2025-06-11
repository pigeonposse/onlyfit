import type { PluginConfig } from 'svgo'

import { LazyLoader } from '$utils/_super/loader'

export type SvgOptions = {
	rename?  : boolean
	plugins? : PluginConfig[]
}

const loader = new LazyLoader( { svgo: () => import( 'svgo' ) } )

export const optimizeSVG = async ( file: File, opts?: SvgOptions ): Promise<File> => {

	if ( file.type !== 'image/svg+xml' ) throw new Error( 'Not an SVG file' )

	const text = await file.text()

	const svgo   = await loader.get( 'svgo' )
	const result = svgo.optimize( text, {
		multipass : true,
		plugins   : opts?.plugins ?? [
			'removeDoctype',
			'removeComments',
			'removeMetadata',
			'removeTitle',
			'removeDesc',
			'removeUselessDefs',
			'removeXMLNS',
			'convertStyleToAttrs',
			'minifyStyles',
		],
	} )

	if ( 'data' in result === false )
		throw new Error( 'SVG optimization failed' )

	const optimizedBlob = new Blob( [ result.data ], { type: 'image/svg+xml' } )

	return new File(
		[ optimizedBlob ],
		opts?.rename ? `compressed-${file.name}` : file.name,
		{ type: 'image/svg+xml' },
	)

}
