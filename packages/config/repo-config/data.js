import {
	getPaths,
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'

const currentDir = getCurrentDir( import.meta.url )
const dataDir    = joinPath( currentDir, 'data' )
const paths      = await getPaths( dataDir )

/** @type {Record<string, string>} */
const fileObject = {}

paths.forEach( filePath => {

	const lastDotIndex = filePath.lastIndexOf( '.' )

	if ( lastDotIndex !== -1 && lastDotIndex < filePath.length - 1 ) {

		const fileExtension       = filePath.substring( lastDotIndex + 1 )
		fileObject[fileExtension] = filePath

	}

} )

export const DATA_PATH = fileObject
