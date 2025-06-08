/**
 * Calculates the percentage reduction between two values.
 * Allows control over decimal precision.
 *
 * @param   {number} current    - The current or reduced value (e.g., compressed size)
 * @param   {number} original   - The original value (e.g., original size)
 * @param   {number} [decimals] - Number of decimal places to return
 * @returns {number}            Percentage difference (0-100), rounded to given decimals
 * @example
 * per100(700, 1000); // returns 30.00
 * per100(700, 1000, 1); // returns 30.0
 * per100(1000, 1000); // returns 0.00
 * per100(0, 1000); // returns 100.00
 * per100(1000, 0); // returns 0.00 (prevents division by zero)
 */
export function per100( current: number, original: number, decimals: number = 2 ): number {

	if ( original === 0 ) return 0
	const diff    = original - current
	const percent = ( diff / original ) * 100
	const factor  = Math.pow( 10, decimals )
	return Math.max( 0, Math.min( 100, Math.round( percent * factor ) / factor ) )

}
