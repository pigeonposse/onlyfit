import JSZip from 'jszip'

import { core } from './core'

import type { MimeType } from '@onlyfit/core'

import { getUUID } from '$utils'

export type ZipOptions = {
	name?    : string
	dotfile? : {
		name    : string
		content : string
	}
}
export type FileInput = File | FileList | File[]

export type RouteDataShared<T extends 'compress' | 'convert'> = {
	/** Web Route */
	route : string
	/**
	 * Route slug
	 */
	slug  : string
	/** Route key */
	key   : string
	/**
	 * Type of route
	 * Must be: `compress` | `convert`
	 */
	type  : T
}

export type ComboMimetype = {
	from : MimeType
	to   : MimeType
}
export type ComboExtension = {
	from : string
	to   : string
}

export const getFileType = ( file: File ) => {

	const nameParts = file.name.split( '.' )
	const ext       = nameParts.pop()?.toLowerCase()

	if ( !ext ) throw new Error( 'File extension not found' )
	const type = file.type || core.utils.mime.getType( file.name )
	if ( !type ) throw new Error( 'File type not found' )

	return type

}

export const buffer2file = ( buffer: ArrayBuffer | undefined, opts:{
	type? : string
	name  : string
} ) => {

	if ( !buffer ) throw new Error( 'Compression failed' )
	const blob = new Blob( [ buffer ] )
	return new File( [ blob ], opts.name, { type: opts.type || blob.type } )

}

export const zipFiles = async ( input: FileInput, opts?: ZipOptions ) => {

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

	return await zip.generateAsync( {
		type               : 'blob',
		compressionOptions : { level: 9 },
	} )

}
