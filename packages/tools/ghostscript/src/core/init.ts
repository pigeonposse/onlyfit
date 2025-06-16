/**
 * @see https://austegard.com/pdf-compressor.html
 */

import initGhostscript             from './pkg/gs.mjs'
import { GhostscriptWasmInstance } from './types'

/**
 *
 * Initialize the WASM module
 *
 * @param   {string}                           route - WASM route
 * @returns {Promise<GhostscriptWasmInstance>}       - Promise of GhostscriptWasmInstance
 * @example
 * // CDN
 * init('https://cdn.jsdelivr.net/npm/@onlyfit/ghostscript/dist/gs.wasm')
 * // local
 * init('./my/folder/gs.wasm')
 */
export const getGhostscript = async ( route: string ): Promise<GhostscriptWasmInstance> =>
	await initGhostscript( { locateFile: () => route } )

