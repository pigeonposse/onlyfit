import { readFile }  from '@dovenv/core/utils'
import { DATA_PATH } from '@onlyfit/repo-config/data'

import { compress } from '.'
// import { init }     from './browser'

// const wasmPatb = getCurrentDir( import.meta.url ) + `/core/pkg/gs.wasm`

export const getPDFData = async () => {

	const path         = DATA_PATH['pdf']
	const data: Buffer = await readFile( path )

	return {
		path,
		buffer : data,
		size   : data.byteLength,
	}

}

const pdf = await getPDFData()

const result = await compress( pdf.buffer )

console.log( { result } )
