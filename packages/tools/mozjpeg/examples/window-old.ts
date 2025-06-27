/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

export const oldMode = async () => {

	const {
		compress, initDecode, initEncode, decode,
	} = await import( '../src/index' )
	await initEncode( null, { locateFile: path => `https://cdn.jsdelivr.net/npm/@jsquash/jpeg/codec/enc/${path}` } )
	await initDecode( null, { locateFile: path => `https://cdn.jsdelivr.net/npm/@jsquash/jpeg/codec/dec/${path}` } )
	return {
		compress,
		decode,
	}

}
