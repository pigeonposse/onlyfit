
import {
	buffer2file,
	getFileType,
	zipFiles,
	type FileInput,
} from '../_shared'
import {
	CONVERSION_ALLOWED,
	ROUTES_DATA,
} from './const'
import { core } from '../_shared/core'

import type { MimeType } from '@onlyfit/core'

type InitCore = typeof core
type PluginKeys = Parameters<InitCore['filter']['data']['get']>[0]
type OptimizeOptions = Record<PluginKeys, unknown>

export class Convert {

	exists( type: MimeType ) {

		return core.filter.find( {
			from : type,
			type : 'converter',
		} )
			? true
			: false

	}

	supported = CONVERSION_ALLOWED
	routes = { value: ROUTES_DATA }

	async file( file: File, to: MimeType, opts?: OptimizeOptions ): Promise<File> {

		const type = getFileType( file )

		const plugin = core.filter.find( {
			from : type,
			type : 'converter',
		} )

		const o = ( opts || {} ) as OptimizeOptions
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const options = ( plugin && plugin.key in o ? o[plugin.key] : undefined ) as any

		const buffer = await plugin?.value.converter?.fn( {
			input : await file.arrayBuffer(),
			from  : type,
			to,
			options,
		} )

		return buffer2file( buffer, {
			type,
			name : file.name,
		} )

	}

	async multiple( input: FileInput, to: MimeType, opts?: OptimizeOptions ): Promise<File[]> {

		const inputArray = ( input instanceof File ) ? [ input ] : Array.from( input )
		return await Promise.all( inputArray.map(
			async file => await this.file( file, to, opts ),
		) )

	}

	zip = zipFiles

}
