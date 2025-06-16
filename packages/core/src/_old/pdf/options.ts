import type { Options } from '../_shared/options'

export const ghostscript = 	{
	pdfSettings : {
		type        : 'select',
		value       : '/ebook',
		required    : false,
		label       : 'PDF Settings',
		description : 'Compression level based on quality/DPI',
		options     : [
			{
				value : '/default',
				label : 'Default (balanced)',
			},
			{
				value : '/screen',
				label : 'Screen (72 DPI, lowest quality)',
			},
			{
				value : '/ebook',
				label : 'eBook (150 DPI, recommended)',
			},
			{
				value : '/printer',
				label : 'Printer (300 DPI, high quality)',
			},
			{
				value : '/prepress',
				label : 'Prepress (300 DPI, maximum quality)',
			},
			{
				value : '/smallest',
				label : 'Smallest (smallest size, most quality loss)',
			},
		],
	},
	customFlags : {
		type        : 'array-string',
		value       : '',
		required    : false,
		label       : 'Ghostscript Flags',
		description : 'Optional additional parameters to pass to the Ghostscript interpreter',
	},
} satisfies Options

