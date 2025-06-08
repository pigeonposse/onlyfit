import { PDFDocument } from 'pdf-lib'

export type PDFOptions = { rename?: boolean }

export const optimizePDF = async ( file: File, opts?: PDFOptions ): Promise<File> => {

	const bytes  = await file.arrayBuffer()
	const pdf    = await PDFDocument.load( bytes )
	const newPdf = await PDFDocument.create()

	const pages = await newPdf.copyPages( pdf, pdf.getPageIndices() )
	pages.forEach( page => newPdf.addPage( page ) )

	const newBytes = await newPdf.save()
	const blob     = new Blob( [ newBytes ], { type: 'application/pdf' } )

	const name = opts?.rename ? `compressed-${file.name}` : file.name
	return new File( [ blob ], name, {
		type         : blob.type,
		lastModified : Date.now(),
	} )

}
