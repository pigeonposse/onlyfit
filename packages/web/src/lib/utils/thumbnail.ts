import { PDFDocument } from 'pdf-lib'

export class Thumbnail {

	static async fromVideo( file: File, seekTo = 0.5 ): Promise<Blob> {

		return new Promise( ( resolve, reject ) => {

			const url   = URL.createObjectURL( file )
			const video = document.createElement( 'video' )

			video.preload     = 'metadata'
			video.src         = url
			video.muted       = true
			video.playsInline = true

			video.onloadeddata = () => {

				video.currentTime = Math.min( seekTo, video.duration || 1 )

			}

			video.onseeked = () => {

				const canvas  = document.createElement( 'canvas' )
				canvas.width  = video.videoWidth
				canvas.height = video.videoHeight

				const ctx = canvas.getContext( '2d' )
				ctx?.drawImage( video, 0, 0, canvas.width, canvas.height )

				canvas.toBlob( blob => {

					URL.revokeObjectURL( url )
					if ( blob ) {

						resolve( blob )

					}
					else {

						reject( new Error( 'Failed to create video thumbnail blob' ) )

					}

				}, 'image/jpeg', 0.7 )

			}

			video.onerror = () => {

				URL.revokeObjectURL( url )
				reject( new Error( 'Failed to load video' ) )

			}

		} )

	}

	static async fromImage( file: File, maxSize = 120 ): Promise<Blob> {

		return new Promise( ( resolve, reject ) => {

			if ( !file.type.startsWith( 'image/' ) ) {

				return reject( new Error( 'Not an image file' ) )

			}

			const reader  = new FileReader()
			reader.onload = () => {

				const img  = new Image()
				img.onload = () => {

					const canvas = document.createElement( 'canvas' )
					const ctx    = canvas.getContext( '2d' )

					const scale   = Math.min( maxSize / img.width, maxSize / img.height )
					canvas.width  = img.width * scale
					canvas.height = img.height * scale

					ctx?.drawImage( img, 0, 0, canvas.width, canvas.height )

					canvas.toBlob( blob => {

						if ( blob ) {

							resolve( blob )

						}
						else {

							reject( new Error( 'Failed to create image thumbnail blob' ) )

						}

					}, 'image/jpeg', 0.7 )

				}
				img.onerror = reject
				img.src     = reader.result as string

			}
			reader.onerror = reject
			reader.readAsDataURL( file )

		} )

	}

	static async fromPdf( file: File ): Promise<Blob> {

		const inputBytes = await file.arrayBuffer()
		const pdfDoc     = await PDFDocument.load( inputBytes )

		const newPdf        = await PDFDocument.create()
		const [ firstPage ] = await newPdf.copyPages( pdfDoc, [ 0 ] )
		newPdf.addPage( firstPage )

		const newPdfBytes = await newPdf.save()
		return new Blob( [ newPdfBytes ], { type: 'application/pdf' } )

	}

	static async get( input: File ): Promise<Blob> {

		const type = input.type

		if ( type.startsWith( 'image/' ) ) {

			return await this.fromImage( input )

		}
		else if ( type.startsWith( 'video/' ) ) {

			return await this.fromVideo( input )

		}
		else if ( type === 'application/pdf' ) {

			return await this.fromPdf( input )

		}
		else {

			throw new Error( 'Unsupported file type for thumbnail generation' )

		}

	}

}
export const blobToBase64 = ( blob: Blob ): Promise<string> => {

	return new Promise( ( resolve, reject ) => {

		const reader     = new FileReader()
		reader.onloadend = () => resolve( reader.result as string )
		reader.onerror   = reject
		reader.readAsDataURL( blob )

	} )

}
export const getThumbnailFromFile = async ( i: File ) => {

	try {

		return await blobToBase64( await Thumbnail.get( i ) )

	}
	catch ( _e ) {

		return

	}

}
