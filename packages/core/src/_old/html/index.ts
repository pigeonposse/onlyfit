import {
	arrayBufferToString,
	stringToArrayBuffer,
} from '../_shared'
import { deps } from '../_shared/deps'

import type { Options } from '@onlyfit/html-minifier-terser'

export class HtmlOptimize {

	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

	async htmlMinifierTerser( opts?: Options ) {

		const { minify } = await deps.get( 'htmlMinimifierTerser' )
		const input      = arrayBufferToString( this.#input )
		const res        = await minify( input, opts )
		return stringToArrayBuffer( res )

	}

}
export class HtmlConvert {

	// eslint-disable-next-line no-unused-private-class-members
	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

}
