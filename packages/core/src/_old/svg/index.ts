
import {
	arrayBufferToString,
	stringToArrayBuffer,
} from '../_shared'
import { deps } from '../_shared/deps'

import type { Config as SVGOptimizeOptions } from '@onlyfit/svgo'

export class SvgOptimize {

	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

	async svgo( opts?: SVGOptimizeOptions ) {

		const { optimize } = await deps.get( 'svgo' )

		const input = arrayBufferToString( this.#input )
		const res   = await optimize( input, opts )

		return stringToArrayBuffer( res.data )

	}

}

export class SvgConvert {

	// eslint-disable-next-line no-unused-private-class-members
	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

}

