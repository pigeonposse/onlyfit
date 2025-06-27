import imageCompression, { Options } from 'browser-image-compression'

export * from 'browser-image-compression'

export type OptimizeOptions = Omit<Options, 'fileType'>
export const optimize = async ( input: ArrayBuffer, type: string, options?: OptimizeOptions ) => {

	const imageFile = new File( [ input ], type, { type: type } )

	const compressedFile = await imageCompression( imageFile, {
		...options,
		fileType : type,
	} )

	return await compressedFile.arrayBuffer()

}
