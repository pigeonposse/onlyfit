import { ICON } from '$lib/icons'

export const getFileIcon = ( file: File ): string => {

	const { type } = file

	if ( type === 'application/zip' || type === 'application/x-zip-compressed' ) return ICON.FILE_ZIP
	if ( type.startsWith( 'image/' ) ) return ICON.FILE_IMAGE
	if ( type.startsWith( 'video/' ) ) return ICON.FILE_VIDEO
	if ( type === 'application/pdf' ) return ICON.FILE_PDF

	const codeTypes = [
		'application/javascript',
		'text/javascript',
		'application/json',
		'text/typescript',
		'application/xml',
		'text/html',
		'text/css',
		'application/x-sh',
		'text/x-python',
	]

	return codeTypes.includes( type ) ? ICON.FILE_CODE : ICON.FILE

}
