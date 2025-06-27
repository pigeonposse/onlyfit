import { getGhostscript }          from './core/init'
import { GhostscriptWasmInstance } from './core/types'

let _ghostscript: GhostscriptWasmInstance | null = null

/**
 * Loads the Ghostscript WASM instance and returns an object with a compress method.
 *
 * @param {string} route - The path to the WASM file.
 * @example
 * const path = 'https://cdn.jsdelivr.net/npm/@onlyfit/ghostscript/data/gs.wasm'
 * await init( path )
 */

export const init = async ( route: string ) => {

	// console.log( route, _ghostscript )
	if ( _ghostscript ) return
	_ghostscript = await getGhostscript( route )

}

export const getInstance = () => {

	if ( !_ghostscript ) throw new Error( 'Ghostscript WASM instance not initialized' )
	return _ghostscript

}
