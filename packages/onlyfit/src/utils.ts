export const getAllNumbersInRange = ( min: number, max: number ): number[] => {

	if ( min > max ) return []
	return Array.from( { length: max - min + 1 }, ( _, i ) => i + min )

}
export const joinPath = ( ...parts: string[] ): string => {

	const cleaned = parts
		.filter( Boolean )
		.map( part => part.replace( /^\/+|\/+$/g, '' ) )

	return '/' + cleaned.join( '/' )

}
export const isURL = ( str: string ): boolean => {

	try {

		new URL( str )
		return true

	}
	catch {

		return false

	}

}

export const jsExtensions = [
	'js',
	'ts',
	'mjs',
	'mts',
	'cjs',
	'cts',
]

