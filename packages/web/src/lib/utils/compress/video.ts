export type VideoOptions = {
	[k in string]: unknown
}

export const optimizeVideo = async (
	file: File,
	opts?: VideoOptions,
): Promise<File> => {

	console.log( opts )
	return file

}
