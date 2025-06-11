export const ALLOWED_TYPES = [
	// Images
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/webp',
	'image/tiff',
	'image/bmp',
	'image/svg+xml',
	// Videos
	'video/mp4',
	'video/quicktime',
	'video/x-msvideo',
	'video/x-matroska',
	'video/x-ms-wmv',
	'video/webm',
	'video/x-flv',
	'video/mp2t',
	'video/3gpp',
	'video/mpeg',

	// Audio
	'audio/mpeg',
	'audio/wav',
	'audio/ogg',
	'audio/mp4',
	'audio/aac',
	'audio/flac',
	'audio/x-ms-wma',
	'audio/x-aiff',
	// Documents
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/vnd.oasis.opendocument.text',
	'application/vnd.oasis.opendocument.spreadsheet',
	'application/vnd.oasis.opendocument.presentation',
	'text/html',
	// ZIP
	'application/zip',
	// Others
	'text/plain',
	'application/json',
	'application/xml',
	'text/css',
	'application/javascript',
	'text/javascript',
]

export const ALLOWED_TYPES_SET = new Set( ALLOWED_TYPES )
const setCurrentDate = () => {

	const now = new Date()
	return now.toLocaleDateString( undefined, {
		weekday : 'long',
		year    : 'numeric',
		month   : 'long',
		day     : 'numeric',
	} )

}

export const COMPRESSION_FILE = () => `# ${PKG.extra.id} - Compression

_Compressed archive generated automatically._

🔗 **Link:** ${PKG.homepage}  
📅 **Date:** ${setCurrentDate()}  

🐛 **Bugs:** ${PKG.bugs.url}  
💖 **Donate:** ${PKG.funding.url}  
👥 **Collective Web:** ${PKG.extra.collective.url}

---

This archive includes uploaded files and a hidden metadata file.
`
