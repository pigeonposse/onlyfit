import { Optimizer } from '@onlyfit/core'

export type CSSOptions = Parameters<Optimizer['css']['csso']>[0]
const arrayBufferToFile = (
	buffer: ArrayBuffer,
	fileName: string,
	mimeType: string = 'application/octet-stream',
): File => {

	const blob = new Blob( [ buffer ], { type: mimeType } )
	return new File( [ blob ], fileName, { type: mimeType } )

}

export const optimizeCss = async (
	file: File,
	opts?: CSSOptions,
): Promise<File> => {

	const optimizer = new Optimizer( await file.arrayBuffer() )
	const res       = await optimizer.css.cleancss( opts )
	return arrayBufferToFile( res, file.name, file.type )

}
