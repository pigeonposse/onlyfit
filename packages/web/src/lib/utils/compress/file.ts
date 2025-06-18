import { Core } from '@onlyfit/core'

import config from '../../../onlyfit.config'

const core = new Core( { plugin: config.plugin } )

export class OptimizeFile {

	static async run( file: File, opts?: {} ): Promise<File> {

		const instance = await core.init()

		const nameParts = file.name.split( '.' )
		const ext       = nameParts.pop()?.toLowerCase()

		if ( !ext ) throw new Error( 'File extension not found' )
		const type = file.type || core.utils.mime.getType( file.name )
		if ( !type ) throw new Error( 'File type not found' )

		const plugin = await instance.filter.getOptimizerPlugin( { type } )
		console.log( plugin )
		const buffer = await plugin?.value.optimizer?.fn( {
			input   : await file.arrayBuffer(),
			type,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			options : opts as any,
		} )
		if ( !buffer ) throw new Error( 'Compression failed' )
		return new File( [ buffer ], file.name, { type: type } )

	}

}
