
import {
	arrayBufferToString,
	stringToArrayBuffer,
} from '../_shared'
import { deps } from '../_shared/deps'

import type { Options as CleanCssOptions }     from '@onlyfit/clean-css'
import type { Options as CssoOptions }         from '@onlyfit/csso'
import type { Options as LightnongcssOptions } from '@onlyfit/lightningcss'

export {
	CleanCssOptions,
	CssoOptions,
	LightnongcssOptions,
}

export class CssOptimize {

	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

	async cleancss( opts?: CleanCssOptions ) {

		const { compress } = await deps.get( 'cleancss' )
		const input        = arrayBufferToString( this.#input )
		const res          = await compress( input, opts )
		return stringToArrayBuffer( res )

	}

	async csso( opts?: CssoOptions ) {

		const { compress } = await deps.get( 'csso' )
		const input        = arrayBufferToString( this.#input )
		const res          = await compress( input, opts )
		return stringToArrayBuffer( res )

	}

	async lightningcss( opts?: LightnongcssOptions ) {

		const { compress } = await deps.get( 'lightningcss' )

		const input = new TextEncoder().encode( arrayBufferToString( this.#input ) )
		const res   = await compress( input, opts )

		return stringToArrayBuffer( new TextDecoder().decode( res ) )

	}

}

export class CssConvert {

	// eslint-disable-next-line no-unused-private-class-members
	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

}
