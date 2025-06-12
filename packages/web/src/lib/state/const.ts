
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
