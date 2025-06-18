import mime from 'mime'

export * from './mime'
import { convert } from './convert'
import { env }     from './env'

import type { MimeType } from './mime'

export const mineUtils = {
	/**
	 * Gets the MIME type for the given extension or path string.
	 *
	 * @param   {string}   input - The input to get the MIME type for
	 * @returns {MimeType}       The MIME type or undefined if not found
	 */
	getType : ( input: string ) => {

		return mime.getType( input ) as MimeType || undefined

	},
	/**
	 * Checks if a given MIME type exists.
	 *
	 * @param   {MimeType | string} input - The MIME type to check
	 * @returns {boolean}                 True if valid/known, false otherwise
	 */
	existsType : ( input: MimeType | string ): boolean => {

		return Boolean( mime.getExtension( input ) )

	},
	/**
	 * Retrieves all unique MIME types associated with the given file extensions or path strings.
	 *
	 * @param   {string | string[]}         input - A single file extension or path string, or an array of file extensions or path strings. If not provided, returns undefined.
	 * @returns {Set<MimeType> | undefined}       A Set containing all unique MIME types associated with the given file extensions or path strings, or undefined if no input is provided.
	 */
	getAllTypes : ( input: string | string[] ) => {

		if ( typeof input === 'string' ) input = [ input ]
		const res: Set<MimeType> = new Set()
		for ( const i of input ) {

			const e = mime.getType( i )
			if ( e ) res.add( e )

		}
		return res.size ? res : undefined

	},

	/**
	 * Gets the file extension for the given MIME type.
	 *
	 * @param   {MimeType}           mimetypes - A single MIME type
	 * @returns {string | undefined}           The file extension or undefined if not found
	 */
	getExtension : ( mimetypes: MimeType ) => {

		return mime.getExtension( mimetypes ) || undefined

	},
	/**
	 * Checks if a given file extension exists.
	 *
	 * @param   {string}  ext - The file extension (with or without dot)
	 * @returns {boolean}     True if known/valid, false otherwise
	 */
	existsExtension : ( ext: string ): boolean => {

		return Boolean( mime.getType( ext ) )

	},
	/**
	 * Retrieves all unique file extensions associated with the given MIME types.
	 *
	 * @param   {MimeType[] | MimeType}   mimetypes - A single MIME type or an array of MIME types. If not provided, returns undefined.
	 * @returns {Set<string> | undefined}           A Set containing all unique file extensions associated with the given MIME types, or undefined if no MIME types are provided.
	 */
	getAllExtensions : ( mimetypes? :MimeType[] | MimeType ) => {

		if ( !mimetypes ) return undefined
		if ( !Array.isArray( mimetypes ) ) mimetypes = [ mimetypes ]

		const exts = new Set<string>()

		for ( const mimetype of mimetypes ) {

			const extSet = mime.getAllExtensions( mimetype )
			extSet?.forEach( ext => exts.add( ext ) )

		}

		return exts

	},

}

export const allUtils = {
	mime : mineUtils,
	env,
	convert,
}

export {
	mime,
	convert,
	env,
}
