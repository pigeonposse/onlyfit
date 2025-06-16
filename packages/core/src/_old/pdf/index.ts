
import { deps } from '../_shared/deps'

import type { CompressOptions as GhostscriptOptions } from '@onlyfit/ghostscript'

export class PdfOptimize {

	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

	async ghostscript( opts?: GhostscriptOptions ) {

		const { compress } = await deps.get( 'ghostscript' )

		const res = await compress( this.#input, opts )
		return res

	}

	async pdfLib( ) {

		const { compress } = await deps.get( 'pdfLib' )

		const res = await compress( this.#input )
		return res

	}

}

export class PdfConvert {

	// eslint-disable-next-line no-unused-private-class-members
	#input : ArrayBuffer

	constructor( input: ArrayBuffer ) {

		this.#input = input

	}

}
