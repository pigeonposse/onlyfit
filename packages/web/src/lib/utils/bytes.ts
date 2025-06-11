export const SIZE_VALUES = {
	bytes     : 'B',
	kilobytes : 'KB',
	megabytes : 'MB',
	gigabytes : 'GB',
	terabytes : 'TB',
} as const

export const formatBytes = ( bytes: number ): string => {

	if ( bytes === 0 ) return '0 B'
	const k     = 1024
	const sizes = Object.values( SIZE_VALUES )
	const i     = Math.floor( Math.log( bytes ) / Math.log( k ) )
	return `${parseFloat( ( bytes / Math.pow( k, i ) ).toFixed( 2 ) )} ${sizes[i]}`

}

export type SizeData = {
	bytes     : number
	kilobytes : number
	megabytes : number
	gigabytes : number
	terabytes : number
	/*+
	 * The formatted size string
	 */
	format    : string
}

export const getSizeData = ( bytes: number ): SizeData => {

	const k = 1024

	return {
		bytes,
		kilobytes : bytes / k,
		megabytes : bytes / Math.pow( k, 2 ),
		gigabytes : bytes / Math.pow( k, 3 ),
		terabytes : bytes / Math.pow( k, 4 ),
		format    : formatBytes( bytes ),
	}

}
