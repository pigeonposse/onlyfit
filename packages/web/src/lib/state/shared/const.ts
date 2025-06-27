
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

_Archive generated automatically._

🔗 **Link:** ${PKG.homepage}  
📅 **Date:** ${setCurrentDate()}  

🐛 **Bugs:** ${PKG.bugs.url}  
💖 **Donate:** ${PKG.funding.url}  
👥 **Collective Web:** ${PKG.extra.collective.url}

---

This archive includes uploaded files and a hidden metadata file.
`

export const CONVERSION_FILE = () => `# ${PKG.extra.id} - Conversion

_Archive generated automatically._

🔗 **Link:** ${PKG.homepage}  
📅 **Date:** ${setCurrentDate()}  

🐛 **Bugs:** ${PKG.bugs.url}  
💖 **Donate:** ${PKG.funding.url}  
👥 **Collective Web:** ${PKG.extra.collective.url}

---

This archive includes uploaded files and a hidden metadata file.
`
