export const arrayBuffer2string = ( input: ArrayBuffer ): string =>
	new TextDecoder( 'utf-8' ).decode( input )

export const string2arrayBuffer = ( input: string ): ArrayBuffer =>
	new TextEncoder().encode( input ).buffer

export const uint8Array2string = ( input: Uint8Array ): string =>
	new TextDecoder().decode( input )

export const string2uint8Array = ( input: string ): Uint8Array =>
	new TextEncoder().encode( input )

export const uint8Array2arrayBuffer = ( input: Uint8Array ): ArrayBuffer =>
	input.buffer.slice( input.byteOffset, input.byteOffset + input.byteLength )

export const arrayBuffer2uint8Array = ( input: ArrayBuffer ): Uint8Array =>
	new Uint8Array( input )

export const convert = {
	arrayBuffer2string,
	string2arrayBuffer,
	uint8Array2string,
	string2uint8Array,
	uint8Array2arrayBuffer,
	arrayBuffer2uint8Array,
}
