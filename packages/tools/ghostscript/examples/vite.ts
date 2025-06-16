/* eslint-disable @typescript-eslint/no-explicit-any */
// import { load } from '../dist/browser.mjs'
import {
	init,
	compress,
} from '../src/browser'

const WASM_PATH = './dist/gs.wasm'

document.addEventListener( 'DOMContentLoaded', () => {

	const pdfFileInput      = document.getElementById( 'pdfFile' ) as HTMLInputElement
	const pdfSettingsSelect = document.getElementById( 'pdfSettings' ) as HTMLSelectElement
	const compressButton    = document.getElementById( 'compressBtn' ) as HTMLButtonElement
	const statusMessage     = document.getElementById( 'statusMessage' ) as HTMLParagraphElement
	const downloadLink      = document.getElementById( 'downloadLink' ) as HTMLAnchorElement

	if ( !pdfFileInput || !pdfSettingsSelect || !compressButton || !statusMessage || !downloadLink ) {

		console.error( 'One or more required DOM elements not found.' )
		statusMessage.textContent = 'Error: Page elements missing. Cannot initialize.'
		return

	}

	compressButton.addEventListener( 'click', async () => {

		const file = pdfFileInput.files?.[0]

		if ( !file ) {

			statusMessage.textContent = 'Please select a PDF file.'
			return

		}

		if ( file.type !== 'application/pdf' ) {

			statusMessage.textContent = 'Please select a valid PDF file (.pdf).'
			return

		}

		statusMessage.textContent  = 'Compressing PDF... This might take a moment.'
		statusMessage.style.color  = 'orange'
		downloadLink.style.display = 'none' // Hide previous download link

		try {

			const fileBuffer          = await file.arrayBuffer() // Read file as ArrayBuffer
			const selectedPdfSettings = pdfSettingsSelect.value as any // Cast to type for safety

			await init( WASM_PATH )

			const compressedPdfArrayBuffer = await compress( fileBuffer, { pdfSettings: selectedPdfSettings } )

			const blob = new Blob( [ compressedPdfArrayBuffer ], { type: 'application/pdf' } )
			const url  = URL.createObjectURL( blob )

			downloadLink.href          = url
			downloadLink.download      = `compressed_${file.name}`
			downloadLink.textContent   = `Download compressed_${file.name}`
			downloadLink.style.display = 'block' // Show download link
			statusMessage.textContent  = 'PDF compressed successfully!'
			statusMessage.style.color  = 'green'

			// Clean up the object URL after a short delay (or when the link is clicked)
			// URL.revokeObjectURL(url); // Revoke when no longer needed to free memory

		}
		catch ( error: any ) {

			statusMessage.textContent = `Error: ${error.message || 'An unknown error occurred during compression.'}`
			statusMessage.style.color = 'red'
			console.error( 'Compression error:', error )

		}

	} )

} )
