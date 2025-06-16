import {
	CompressOptions,
	minify as cssoMinify,
	MinifyOptions,
} from 'csso'

export type Options = MinifyOptions & CompressOptions

export const minify = ( input: string, opts?: Options ) =>
	cssoMinify( input, opts )

export const compress = ( input: string, opts?: Options ) =>
	cssoMinify( input, opts ).css
