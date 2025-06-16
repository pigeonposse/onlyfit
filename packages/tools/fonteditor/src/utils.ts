export const convertFontFormats = [
	'ttf',
	'otf',
	'eot',
	'woff',
	'woff2',
	'svg',
] as const

export type FontFormat = typeof convertFontFormats[number]
