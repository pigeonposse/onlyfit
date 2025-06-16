// @ts-ignore
import { minify as minifyBrowser } from 'html-minifier-terser/dist/htmlminifier.esm.bundle'

import type { Options } from 'html-minifier-terser'

export type { Options }

export const minify = ( input: string, opts?: Options ) =>
	minifyBrowser( input, opts )
