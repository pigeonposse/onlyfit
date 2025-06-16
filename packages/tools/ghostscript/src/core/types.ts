export type GhostscriptWasmInstance = {
	callMain : ( args: string[] ) => Promise<{
		code   : number
		stdout : string
		stderr : string
	} | undefined>

	FS: {
		writeFile : ( path: string, data: Uint8Array, opts?: {
			encoding? : 'binary' | 'utf8'
			flags?    : string
		} ) => void
		readFile  : ( path: string, opts?: {
			encoding? : 'binary' | 'utf8'
			flags?    : string
		} ) => Uint8Array
	}
}
