// @ts-ignore
import CleanCSS from './core/node.js'

import type CleanCSSClass from 'clean-css'

export type Options = Omit<CleanCSSClass.OptionsPromise, 'returnPromise'>

export const compress = async ( input: string, opts?: Options ) => {

	const compressor = new ( CleanCSS as typeof CleanCSSClass )( {
		returnPromise : true,
		...opts,
	} )
	const res        = await compressor.minify( input )
	return res.styles

}
