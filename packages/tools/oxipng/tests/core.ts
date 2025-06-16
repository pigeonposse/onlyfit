import {
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'
import { readFile } from 'node:fs/promises'

const imagepath = joinPath( getCurrentDir( import.meta.url ), 'image.png' )

export const getImageData = async () => {

	const imageData: Buffer = await readFile( imagepath )
	return {
		path   : imagepath,
		buffer : imageData,
		size   : imageData.byteLength,
	}

}
