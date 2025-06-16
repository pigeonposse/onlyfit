
import {
	CompressInput,
	CompressOptions,
} from './types'

import type { GhostscriptWasmInstance } from './core/types'

export class Compress {

	#instance : GhostscriptWasmInstance
	constructor( instance: GhostscriptWasmInstance ) {

		this.#instance = instance

	}

	#getInput( input: CompressInput ): Uint8Array {

		if ( typeof Buffer !== 'undefined' && input instanceof Buffer )
			return new Uint8Array( input.buffer, input.byteOffset, input.byteLength )
		if ( input instanceof Uint8Array )
			return input
		if ( input instanceof ArrayBuffer ) return new Uint8Array( input )

		throw new Error( 'Unsupported input type for compression.' )

	}

	async run(
		input: CompressInput,
		opts?: CompressOptions,
	): Promise<ArrayBuffer> {

		const instance = this.#instance

		const inputFileName  = 'input.pdf'
		const outputFileName = 'output.pdf'

		const {
			pdfSettings = '/ebook',
			customFlags,
		} = opts || {}

		const inputUint8Array = this.#getInput( input )

		const args: string[] = [
			'-sDEVICE=pdfwrite',
			'-dCompatibilityLevel=1.4',
			`-dPDFSETTINGS=${pdfSettings}`,
			'-dNOPAUSE',
			'-dQUIET',
			'-dBATCH',
			`-sOutputFile=${outputFileName}`,
			inputFileName,
			...( customFlags ?? [] ),
		]

		instance.FS.writeFile( inputFileName, inputUint8Array )
		await instance.callMain( args )

		const unit8array = instance.FS.readFile( outputFileName ) as Uint8Array
		return unit8array.buffer

	}

}
