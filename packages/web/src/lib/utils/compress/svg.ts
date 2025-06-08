import type * as SVGO from 'svgo'

export type SvgOptions = {
	rename?  : boolean
	plugins? : SVGO.PluginConfig[]
}
let svgo: typeof SVGO | undefined = undefined

export const optimizeSVG = async ( file: File, opts?: SvgOptions ): Promise<File> => {

	if ( !svgo ) svgo = await import( 'svgo' )

	if ( file.type !== 'image/svg+xml' ) throw new Error( 'Not an SVG file' )

	const text = await file.text()

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

	if ( 'data' in result === false ) {

		throw new Error( 'SVG optimization failed' )

	}

	const optimizedBlob = new Blob( [ result.data ], { type: 'image/svg+xml' } )

	return new File(
		[ optimizedBlob ],
		opts?.rename ? `compressed-${file.name}` : file.name,
		{ type: 'image/svg+xml' },
	)

}
