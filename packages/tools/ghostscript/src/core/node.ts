
import type { GhostscriptWasmInstance } from './types'

export const loadGhostscript: () => Promise<GhostscriptWasmInstance> = async () => {

	const { default: ghostscript } = await import( '../../data/gs.js' )
	return await ghostscript() as GhostscriptWasmInstance

}
