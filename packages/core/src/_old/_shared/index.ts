export const arrayBufferToString = ( buffer: ArrayBuffer ): string => {

	const decoder = new TextDecoder( 'utf-8' )
	return decoder.decode( buffer )

}
export const stringToArrayBuffer = ( str: string ): ArrayBuffer => {

	const encoder = new TextEncoder()
	return encoder.encode( str )

}
