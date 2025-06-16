import init, {
	transform,
	type TransformOptions,
} from 'lightningcss-wasm'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Options = Partial<Omit<TransformOptions<any>, 'code'>>
export { init }
export { transform }

export const compress = ( input: Uint8Array, opts?: Options ) =>
	transform( {
		filename : opts?.filename || '<unknown>',
		code     : input,
		...opts,
	} ).code
