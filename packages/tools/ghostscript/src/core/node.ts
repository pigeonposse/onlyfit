// @ts-ignore
import ghostscript                 from './pkg/gs'
import { GhostscriptWasmInstance } from './types'

type GhostscriptModuleLoader = () => Promise<GhostscriptWasmInstance>

export const loadGhostscript: GhostscriptModuleLoader = ghostscript as GhostscriptModuleLoader
