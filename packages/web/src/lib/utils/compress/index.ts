import JSZip from 'jszip'

import { OptimizeFile } from './file'

import { getUUID } from '$utils/string'

export type ZipOptions = {
	name?    : string
	dotfile? : {
		name    : string
		content : string
	}
}

export type FileInput = File | FileList | File[]

export class Optimize {

	static async file( input: File ): Promise<File> {

		return await OptimizeFile.run( input )

	}

	static async multiple( input: FileInput ): Promise<File[]> {

		const inputArray = ( input instanceof File ) ? [ input ] : Array.from( input )
		return await Promise.all( inputArray.map(
			async file => await Optimize.file( file ),
		) )

	}

	static async zip( input: FileInput, opts?: ZipOptions ): Promise<Blob> {

		const zip        = new JSZip()
		const inputArray = ( input instanceof File ) ? [ input ] : Array.from( input )
		for ( const i of inputArray ) zip.file( i.name, i )

		if ( opts?.dotfile ) {

			const {
				name, content,
			} = opts.dotfile
			const zipName = name.startsWith( '.' ) ? name : '.' + name

			if ( !zip.file( zipName ) ) zip.file( zipName, content )
			else zip.file( zipName + '-' + getUUID(), content )

		}

		return await zip.generateAsync( { type: 'blob' } )

	}

}
