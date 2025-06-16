/* eslint-disable jsdoc/check-tag-names */
export type CompressOptions = {
	/**
	 * Specifies the PDFSETTINGS to use for compression, controlling the output quality and file size.
	 * Choose from the following predefined settings:
	 * - `'/default'`: (Default if `pdfSettings` is not specified) Standard quality, often a good balance.
	 * - `'/screen'`: Low quality (72 DPI), suitable for on-screen viewing and smallest file size.
	 * - `'/ebook'`: Medium quality (150 DPI), good for e-books and general web use.
	 * - `'/printer'`: High quality (300 DPI), suitable for desktop printers.
	 * - `'/prepress'`: Maximum quality (300 DPI), preserves most information for high-end print production.
	 * - `'/smallest'`: Attempts to create the smallest possible file size, potentially at a significant loss of quality.
	 *
	 * If omitted, the default compression setting is `'/ebook'`.
	 */
	pdfSettings? : '/default' | '/screen' | '/ebook' | '/printer' | '/prepress' | '/smallest'
	/**
	 * Additional flags to pass to the Ghostscript interpreter.
	 *
	 * @experimental
	 */
	customFlags? : string[]
}
export type CompressInput = Buffer | ArrayBuffer | Uint8Array
