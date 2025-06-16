
import { PDFDocument } from 'pdf-lib'

export * from 'pdf-lib'

export const compress = async ( input: ArrayBuffer ): Promise<ArrayBuffer> => {

	const originalPdf   = await PDFDocument.load( input )
	const compressedPdf = await PDFDocument.create()

	// Copia todas las páginas (sin copiar los metadatos ni formularios)
	const copiedPages = await compressedPdf.copyPages( originalPdf, originalPdf.getPageIndices() )
	copiedPages.forEach( page => compressedPdf.addPage( page ) )

	// Serializa el PDF a bytes
	const compressedBytes = await compressedPdf.save( { useObjectStreams: true } )

	return compressedBytes.buffer.slice(
		compressedBytes.byteOffset,
		compressedBytes.byteOffset + compressedBytes.byteLength,
	)

}
