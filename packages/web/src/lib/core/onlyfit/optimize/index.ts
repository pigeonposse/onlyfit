
import {
	allSupportedExtensions,
	allSupportedTypes,
} from './mimetypes'
import {
	buffer2file,
	getFileType,
	zipFiles,
	type FileInput,
} from '../_shared'
import { ROUTES_DATA } from './const'
import { core }        from '../_shared/core'

import type { MimeType } from '@onlyfit/core'

type InitCore = typeof core
type PluginKeys = Parameters<InitCore['filter']['data']['get']>[0]
type OptimizeOptions = Record<PluginKeys, unknown>

export class Optimize {

	exists( type: MimeType ) {

		return core.filter.find( {
			from : type,
			type : 'optimizer',
		} )
			? true
			: false

	}

	routes = {
		value   : ROUTES_DATA,
		grouped : Object.groupBy( ROUTES_DATA, d => d.data.group || 'group' ),
	}

	supported = {
		mimetypes  : allSupportedTypes,
		extensions : allSupportedExtensions,
	}

	find( type: MimeType ) {

		return core.filter.find( {
			from : type,
			type : 'optimizer',
		} )

	}

	async file( file: File, opts?: OptimizeOptions ): Promise<File> {

		const type = getFileType( file )

		const plugin = await this.find( type )

		const buffer = await plugin?.value.optimizer?.fn( {
			input   : await file.arrayBuffer(),
			type,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			options : opts as any,
		} )

		return buffer2file( buffer, {
			type,
			name : file.name,
		} )

	}

	async multiple( input: FileInput ): Promise<File[]> {

		const inputArray = ( input instanceof File ) ? [ input ] : Array.from( input )
		return await Promise.all( inputArray.map(
			async file => await this.file( file ),
		) )

	}

	zip = zipFiles

}
