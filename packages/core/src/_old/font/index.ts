
import { deps } from '../_shared/deps'

import type {
	ConvertOptions,
	FontFormat,
} from '@onlyfit/fonteditor'

export class FontOptimize {

	// eslint-disable-next-line no-unused-private-class-members
	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

}

export class FontConvert {

	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

	async fonteditor( from: FontFormat, to:FontFormat, opts?: ConvertOptions ) {

		const { Convert } = await deps.get( 'fonteditor' )
		const convert     = new Convert( this.#input, from, opts )
		return await convert.to( to )

	}

}
