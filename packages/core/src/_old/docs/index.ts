
import { deps } from '../_shared/deps'

import type {
	Options,
	BookType,
} from '@onlyfit/xlsx'

export class DocsOptimize {

	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

	async xlsx( type: BookType ) {

		const { Compress } = await deps.get( 'xlsx' )
		const cv           = new Compress( this.#input, type )

		return await cv.run( )

	}

}
export class DocsConvert {

	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

	async xlsx( type: BookType, opts?: Options ) {

		const { Convert } = await deps.get( 'xlsx' )
		const cv          = new Convert( this.#input, opts )

		return await cv.to( type )

	}

}
