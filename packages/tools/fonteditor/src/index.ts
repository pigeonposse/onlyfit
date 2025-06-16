/* eslint-disable @stylistic/object-curly-newline */
import {
	Font,
	woff2,
} from 'fonteditor-core'

import { convertFontFormats } from './utils'

import type { FontFormat } from './utils'

export { Font }

let isWasmLoaded = false

const fetchFromUNPKG = async () =>
	await fetch( 'https://unpkg.com/fonteditor-core/woff2/woff2.wasm' )
		.then( r => r.arrayBuffer() )

type WasmWoff2Input = string | ArrayBuffer | ( ( d:{ fetchFromUNPKG: typeof fetchFromUNPKG } ) => Promise<ArrayBuffer> )

export const initWoff2Wasm = async ( wasmUrl?: WasmWoff2Input ) => {

	if ( isWasmLoaded ) return

	const woffInput = typeof wasmUrl === 'function' ? await wasmUrl( { fetchFromUNPKG } ) : wasmUrl
	await woff2.init( woffInput )
	isWasmLoaded = true

}

export type ConvertOptions = {
	/** Required in browser */
	woff2Wasm? : WasmWoff2Input
}
export class Convert {

	#input
	#options
	#type
	formats = convertFontFormats

	constructor( input: Buffer | ArrayBuffer, type : FontFormat, options?: ConvertOptions ) {

		this.#input   = input instanceof ArrayBuffer ? input : input.buffer.slice( input.byteOffset, input.byteOffset + input.byteLength )
		this.#options = options
		this.#type    = type

	}

	async #initWoffWasm() {

		await initWoff2Wasm( this.#options?.woff2Wasm )

	}

	async #writeFont( type: FontFormat ): Promise<ArrayBuffer> {

		if ( type === 'woff2' || this.#type === 'woff2' ) await this.#initWoffWasm()

		const font = await Font.create( this.#input, {
			type            : this.#type,
			subset          : [],
			hinting         : true,
			compound2simple : false,

		} )

		const buffer = font.write( {
			type     : type,
			toBuffer : true,
		} )

		return buffer

	}

	async woff( ): Promise<ArrayBuffer> {

		return this.#writeFont( 'woff' )

	}

	async woff2( ): Promise<ArrayBuffer> {

		await this.#initWoffWasm()
		return this.#writeFont( 'woff2' )

	}

	async ttf( ): Promise<ArrayBuffer> {

		return this.#writeFont( 'ttf' )

	}

	async otf( ): Promise<ArrayBuffer> {

		return this.#writeFont( 'otf' )

	}

	async eot( ): Promise<ArrayBuffer> {

		return this.#writeFont( 'eot' )

	}

	async svg( ): Promise<ArrayBuffer> {

		return this.#writeFont( 'svg' )

	}

	async to( format: FontFormat ): Promise<ArrayBuffer> {

		return this.#writeFont( format )

	}

}

