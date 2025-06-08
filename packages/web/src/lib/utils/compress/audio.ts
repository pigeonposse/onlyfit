export type AudioOptions = {
	[k in string]: unknown
}

export const optimizeAudio = async (
	file: File,
	opts?: AudioOptions,
): Promise<File> => {

	console.log( opts )
	return file

}
