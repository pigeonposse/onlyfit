import { SvelteMap } from 'svelte/reactivity'

import { COMPRESSION_FILE } from './shared/const'
import {
	SharedState,
	type SharedStateProps,
} from './shared/index.svelte'
import { createWorkerState } from './shared/worker.svelte'

import type { FileInput } from '$core/onlyfit'

import { browser }  from '$app/environment'
import { Optimize } from '$core/onlyfit'
import {
	getFileIcon,
	getSizeData,
	getThumbnailFromFile,
	per100,
} from '$utils'
import { isURL }              from '$utils/string'
import { init as initWorker } from '$worker'

if ( browser ) await initWorker.init()
export class CompressionState extends SharedState {

	output       : Blob | undefined = $state()
	data
	#compressed
	#instance
	#files
	allowedTypes : Set<string> | undefined = $state()
	supported
	routes

	constructor( props: SharedStateProps ) {

		super( props )

		this.#instance = new Optimize()
		this.supported = this.#instance.supported
		this.routes    = this.#instance.routes

		this.#files      = new SvelteMap<string, File>()
		this.#compressed = new SvelteMap<string, File>()

		this.data = $derived.by( () => {

			const files = Array.from( this.#files.values() )

			const compressed     = Array.from( this.#compressed.values() )
			const filesSize      = files.reduce( ( acc, f ) => acc + f.size, 0 ) || 0
			const compressedSize = compressed.reduce( ( acc, f ) => acc + f.size, 0 ) || 0

			// console.log( {
			// 	_files : this.#files,
			// 	files,
			// } )

			const res = {
				files : [ ...files ].map( file => {

					const compressed = this.#compressed.get( file.name )
					console.log( { compressed } )
					return {
						init       : this.#init( file.type ),
						/**
						 * Icon class like: _i-fa6-solid:file_
						 */
						icon       : getFileIcon( file ),
						/**
						 * Whether compression is allowed
						 */
						allowed    : this.allowedTypes?.has( file.type ),
						compressed : compressed
							? {
								file  : compressed,
								size  : getSizeData( compressed.size ),
								saved : {
									value : file.size - compressed.size,
									x100  : `${per100( compressed.size, file.size )}%`,
								},
							}
							: undefined,
						/**
						 * Original file
						 */
						file : file,
						size : getSizeData( file.size ),
					}

				} ),
				total : {
					files : {
						count : this.#files.size,
						size  : getSizeData( filesSize ),
					},
					compressed : {
						count     : this.#compressed.size,
						saved     : getSizeData( compressedSize ),
						size      : getSizeData( filesSize - compressedSize ),
						savedX100 : `${per100( filesSize - compressedSize, filesSize )}%`,
					},
				},
			}
			// console.log( res )
			return res

		} )

	}

	// memory cache
	#initCache = new Map<string, boolean>()

	#init( type: string ) {

		const wkS     = createWorkerState<boolean>()
		const wkConst = wkS.const
		const result  = wkS.state

		if ( this.#initCache.get( type ) === true ) {

			result.status = wkConst.FINISHED
			result.value  = true
			return result

		}

		const plugin = this.#instance.find( type )

		if ( !plugin ) {

			result.status = wkConst.ERROR
			result.value  = false
			return result

		}

		initWorker.sendAndListen( { type: plugin.key }, e => {

			console.log( e )
			if ( e.data.status === wkConst.FINISHED ) {

				result.status = wkConst.FINISHED
				result.value  = !!e.data.data
				if ( result.value ) this.#initCache.set( type, true )

			}
			else if ( e.data.status === wkConst.ERROR ) {

				result.status = wkConst.ERROR
				result.value  = false

			}

		} )

		return result

	}

	#getInput( i?: FileInput ) {

		if ( !i ) throw new Error( 'Not file(s) found' )
		return ( i instanceof File ) ? [ i ] : Array.from( i )

	}

	async reset() {

		this.#files.clear()
		this.#compressed.clear()
		this.loading = false
		this.output  = undefined

	}

	async addLink( i?: string ) {

		const fileFromUrl = async ( url: string, filename?: string ): Promise<File> => {

			if ( !isURL( url ) ) throw new Error( `Invalid URL "${url}"` )
			const res = await fetch( url )
			if ( !res.ok ) throw new Error( `Failed to fetch "${url}", status: ${res.status}` )
			const blob = await res.blob()
			const type = blob.type || 'application/octet-stream'
			const name = filename || url.split( '/' ).pop() || 'file'
			return new File( [ blob ], name, { type } )

		}
		const fn = async () => {

			if ( !i ) throw new Error( 'Not file(s) found' )
			if ( typeof i !== 'string' ) throw new Error( 'Failed to add file from link' )

			this.add( await fileFromUrl( i ) )

		}
		return await this._run( 'Error adding file(s)', fn() )

	}

	async add( i?: FileInput ) {

		const fn = async () => {

			const inputArray         = this.#getInput( i )
			const validFiles: File[] = []

			for ( const file of inputArray ) {

				if ( this.#files.has( file.name ) ) this._not.send( `File already exists: ${file.name}`, 'warn' )
				else validFiles.push( file )

				// else if ( ALLOWED_TYPES_SET.has( file.type ) ) validFiles.push( file )
				// else this._not.send( `Unsupported file: ${file.name}`, 'warn' )

			}

			// console.log( inputArray )
			if ( !validFiles.length ) {

				this._not.send( 'No supported files were added.', 'error' )
				return

			}

			this.output = undefined
			for ( const input of validFiles ) this.#files.set( input.name, input )

		}

		return await this._run( 'Error adding file(s)', fn() )

	}

	async #remove( i: FileInput ) {

		const inputs = this.#getInput( i )
		for ( const input of inputs ) {

			this.#files.delete( input.name )
			this.#compressed.delete( input.name )

		}

	}

	async remove( i: FileInput ) {

		return await this._run( 'Error removing file(s)', this.#remove( i ) )

	}

	async #exec( i:File ) {

		const isCompressed = this.#compressed.has( i.name )
		if ( isCompressed ) return
		if ( !this.allowedTypes?.has( i.type ) ) return

		const file = await this.#instance.file( i )

		this.#compressed.set( file.name, file )

	}

	async #zipFile( i: FileInput ) {

		return await this.#instance.zip( i, { dotfile : {
			name    : '.' + PKG.extra.id + '.md',
			content : COMPRESSION_FILE(),
		} } )

	}

	async executeOne( i: File ) {

		return await this._run( 'Error compressing file', this.#exec( i ) )

	}

	async execute( ) {

		this.output = undefined
		const fn    = async () => {

			const inputs = this.#getInput( Array.from( this.#files.values() ) )
			await Promise.all( inputs.map( async i => {

				await this.#exec( i )

			} ) )
			const res   = await this.#zipFile( Array.from( this.#compressed.values() ) )
			this.output = res

		}
		return await this._run( 'Error compressing file(s)', fn( ) )

	}

	#thumbs = new Map<string, string | undefined>( )

	async getThumbnail( file: File ) {

		if ( !this.output ) this.#thumbs.clear()
		if ( !this.#thumbs.has( file.name ) ) this.#thumbs.set( file.name, await getThumbnailFromFile( file ) )
		return this.#thumbs.get( file.name )

	}

}
