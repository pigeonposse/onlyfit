import { deps } from './_shared'

import type { Optimizer } from '@onlyfit/core'

export type HtmlOptions = Parameters<Optimizer['html']['htmlMinifierTerser']>[0]

const arrayBufferToFile = (
	buffer: ArrayBuffer,
	fileName: string,
	mimeType: string = 'application/octet-stream',
): File => {

	const blob = new Blob( [ buffer ], { type: mimeType } )
	return new File( [ blob ], fileName, { type: mimeType } )

}
export const optimizeHtml = async (
	file: File,
	opts?: HtmlOptions,
): Promise<File> => {

	const { Optimizer } = await deps.get( 'onlyfit' )
	const optimizer     = new Optimizer( await file.arrayBuffer() )
	const res           = await optimizer.html.htmlMinifierTerser( opts )
	return arrayBufferToFile( res, file.name, file.type )

}
