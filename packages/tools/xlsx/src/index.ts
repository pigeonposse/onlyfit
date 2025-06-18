import * as XLSX from 'xlsx'

import type {
	BookType,
	WritingOptions,
} from 'xlsx'

export {
	XLSX,
	BookType,
}

export type Options = Omit<WritingOptions, 'type' | 'bookType'>
export const TYPES: { [K in BookType]: K } = {
	xlsx  : 'xlsx',
	xlsm  : 'xlsm',
	xlsb  : 'xlsb',
	xls   : 'xls',
	xla   : 'xla',
	biff8 : 'biff8',
	biff5 : 'biff5',
	biff2 : 'biff2',
	xlml  : 'xlml',
	ods   : 'ods',
	fods  : 'fods',
	csv   : 'csv',
	txt   : 'txt',
	sylk  : 'sylk',
	slk   : 'slk',
	html  : 'html',
	dif   : 'dif',
	rtf   : 'rtf',
	prn   : 'prn',
	eth   : 'eth',
	dbf   : 'dbf',
}
export class Compress {

	#input
	#type

	constructor( input: ArrayBuffer | Buffer, type?: BookType ) {

		this.#input = input
		this.#type  = type

	}

	async run( ): Promise<ArrayBuffer> {

		const workbook = XLSX.read( this.#input, { type: 'buffer' } )
		return XLSX.write( workbook, {
			type        : 'array',
			bookType    : this.#type,
			compression : true,
		} )

	}

}

/**
 * Convert input from format (BookType)
 */
export class Convert {

	#input
	options

	constructor( input: ArrayBuffer | Buffer, opts?: Options ) {

		this.#input  = input
		this.options = opts

	}

	async #run( type: BookType ) {

		const workbook = XLSX.read( this.#input, { type: 'buffer' } )
		return XLSX.write( workbook, {
			type        : 'array',
			bookType    : type,
			compression : true,
			...( this.options || {} ),
		} )

	}

	/**
	 * Detects the input format and compresses it to the specified output book type.
	 *
	 * @param   {BookType}             type - The desired output book type.
	 * @returns {Promise<ArrayBuffer>}      A Promise that resolves to an ArrayBuffer in the specified format.
	 */
	async to( type: BookType ): Promise<ArrayBuffer> {

		return await this.#run( type )

	}

	/**
	 * Converts the input buffer to an XLSX ArrayBuffer.
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in XLSX format.
	 */
	async toXLSX(): Promise<ArrayBuffer> {

		return await this.#run( 'xlsx' )

	}

	/**
	 * Converts the input buffer to an XLSM ArrayBuffer.
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in XLSM format.
	 */
	async toXLSM(): Promise<ArrayBuffer> {

		return await this.#run( 'xlsm' )

	}

	/**
	 * Converts the input buffer to an XLSB ArrayBuffer.
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in XLSB format.
	 */
	async toXLSB(): Promise<ArrayBuffer> {

		return await this.#run( 'xlsb' )

	}

	/**
	 * Converts the input buffer to an ODS ArrayBuffer.
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in ODS format.
	 */
	async toODS(): Promise<ArrayBuffer> {

		return await this.#run( 'ods' )

	}

	/**
	 * Converts the input buffer to an XLS ArrayBuffer (Excel 97-2003 format).
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in XLS format.
	 */
	async toXLS(): Promise<ArrayBuffer> {

		return await this.#run( 'xls' )

	}

	/**
	 * Converts the input buffer to an XLA ArrayBuffer (Excel Add-in format).
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in XLA format.
	 */
	async toXLA(): Promise<ArrayBuffer> {

		return await this.#run( 'xla' )

	}

	/**
	 * Converts the input buffer to a BIFF8 ArrayBuffer (Excel Binary Format 8.0).
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in BIFF8 format.
	 */
	async toBIFF8(): Promise<ArrayBuffer> {

		return await this.#run( 'biff8' )

	}

	/**
	 * Converts the input buffer to a BIFF5 ArrayBuffer (Excel Binary Format 5.0).
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in BIFF5 format.
	 */
	async toBIFF5(): Promise<ArrayBuffer> {

		return await this.#run( 'biff5' )

	}

	/**
	 * Converts the input buffer to a BIFF2 ArrayBuffer (Excel Binary Format 2.0).
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in BIFF2 format.
	 */
	async toBIFF2(): Promise<ArrayBuffer> {

		return await this.#run( 'biff2' )

	}

	/**
	 * Converts the input buffer to an XLML ArrayBuffer (Excel XML Spreadsheet format).
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in XLML format.
	 */
	async toXLML(): Promise<ArrayBuffer> {

		return await this.#run( 'xlml' )

	}

	/**
	 * Converts the input buffer to a FODS ArrayBuffer (Flat OpenDocument Spreadsheet).
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in FODS format.
	 */
	async toFODS(): Promise<ArrayBuffer> {

		return await this.#run( 'fods' )

	}

	/**
	 * Converts the input buffer to a CSV ArrayBuffer.
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in CSV format.
	 */
	async toCSV(): Promise<ArrayBuffer> {

		return await this.#run( 'csv' )

	}

	/**
	 * Converts the input buffer to a TXT ArrayBuffer.
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in TXT format.
	 */
	async toTXT(): Promise<ArrayBuffer> {

		return await this.#run( 'txt' )

	}

	/**
	 * Converts the input buffer to a SYLK ArrayBuffer.
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in SYLK format.
	 */
	async toSYLK(): Promise<ArrayBuffer> {

		return await this.#run( 'sylk' )

	}

	/**
	 * Converts the input buffer to an HTML ArrayBuffer.
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in HTML format.
	 */
	async toHTML(): Promise<ArrayBuffer> {

		return await this.#run( 'html' )

	}

	/**
	 * Converts the input buffer to a DIF ArrayBuffer (Data Interchange Format).
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in DIF format.
	 */
	async toDIF(): Promise<ArrayBuffer> {

		return await this.#run( 'dif' )

	}

	/**
	 * Converts the input buffer to an RTF ArrayBuffer (Rich Text Format).
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in RTF format.
	 */
	async toRTF(): Promise<ArrayBuffer> {

		return await this.#run( 'rtf' )

	}

	/**
	 * Converts the input buffer to a PRN ArrayBuffer (Lotus Formatted Text).
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in PRN format.
	 */
	async toPRN(): Promise<ArrayBuffer> {

		return await this.#run( 'prn' )

	}

	/**
	 * Converts the input buffer to an ETH ArrayBuffer (EtherCalc format).
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in ETH format.
	 */
	async toETH(): Promise<ArrayBuffer> {

		return await this.#run( 'eth' )

	}

	/**
	 * Converts the input buffer to a DBF ArrayBuffer (dBASE format).
	 *
	 * @returns {Promise<ArrayBuffer>} A Promise that resolves to an ArrayBuffer in DBF format.
	 */
	async toDBF(): Promise<ArrayBuffer> {

		return await this.#run( 'dbf' )

	}

}
