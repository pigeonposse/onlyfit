/**
 * @see https://austegard.com/pdf-compressor.html
 */

import { GhostscriptWasmInstance } from './types'

/**
 *
 * Initialize the WASM module
 *
 * @param   {string}                           route - WASM route
 * @returns {Promise<GhostscriptWasmInstance>}       - Promise of GhostscriptWasmInstance
 * @example
 * // CDN
 * getGhostscript('https://cdn.jsdelivr.net/npm/@onlyfit/ghostscript/dist/gs.wasm')
 * // local
 * getGhostscript('./my/folder/gs.wasm')
 */
export const getGhostscript = async ( route: string ): Promise<GhostscriptWasmInstance> => {

	const { default: initGhostscript } = await import( './browser.js' )
	return await initGhostscript( { locateFile: () => route } )

}

