
/**
 * @see https://www.npmjs.com/package/browser-or-node
 */

const isBrowser: boolean = typeof window !== 'undefined' && typeof window.document !== 'undefined'

const isNode: boolean = typeof process !== 'undefined'
	&& process.versions != null
	&& process.versions.node != null

const isWebWorker: boolean = typeof self === 'object'
	&& self.constructor
	&& self.constructor.name === 'DedicatedWorkerGlobalScope'

// https://github.com/jsdom/jsdom/issues/1537#issuecomment-229405327
const isJsDom: boolean = ( typeof window !== 'undefined' && window.name === 'nodejs' )
	|| ( typeof navigator !== 'undefined'
		&& 'userAgent' in navigator
		&& typeof navigator.userAgent === 'string'
		&& ( navigator.userAgent.includes( 'Node.js' )
			|| navigator.userAgent.includes( 'jsdom' ) ) )

// @ts-ignore
const isDeno: boolean = typeof Deno !== 'undefined' && typeof Deno.version !== 'undefined' && typeof Deno.version.deno !== 'undefined'

const isBun = typeof process !== 'undefined' && process.versions != null && process.versions.bun != null

export const env = {
	isBrowser,
	isWebWorker,
	isNode,
	isJsDom,
	isDeno,
	isBun,
}
