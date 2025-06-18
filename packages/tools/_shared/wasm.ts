
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any
const fetchArraybuffer = async ( url: string ) => {

	const res = await fetch( url )
	if ( !res.ok ) throw new Error( `Failed to fetch URL: ${res.status} ${res.statusText}` )
	return await res.arrayBuffer()

}

const getWasmURLs = (
	libraryName: string,
	path: string,
	version?: string,
) => {

	const versionTag = version ? `@${version}` : ''
	path             = path.startsWith( '/' ) ? path : `/${path}`
	return {
		jsdelivr : `https://cdn.jsdelivr.net/npm/${libraryName}${versionTag}${path}`,
		unpkg    : `https://unpkg.com/${libraryName}${versionTag}${path}`,
		custom   : ( cb: ( d: {
			libraryName : string
			path        : string
			version?    : string
		} ) => string ) => cb( {
			libraryName,
			path,
			version,
		} ),
	}

}

export const getFetchUtils = ( libraryName: string, path:string, version?: string ) => {

	const wasmURLs = getWasmURLs( libraryName, path, version )
	return {
		wasmURLs,
		fetchFromJSDelivr : () => fetchArraybuffer( wasmURLs.jsdelivr ),
		fetchFromUNPKG    : () => fetchArraybuffer( wasmURLs.unpkg ),
		/**
		 * Multi-cdn fetch
		 *
		 * @description
		 * Tries to fetch a WASM file from JSDelivr, if it fails, fetches from UNPKG.
		 * @returns {Promise<ArrayBuffer>} - ArrayBuffer of the WASM file
		 */
		fetchFromCDNs     : () => {

			try {

				return fetchArraybuffer( wasmURLs.jsdelivr )

			}
			catch {

				return fetchArraybuffer( wasmURLs.unpkg )

			}

		},
	}

}

export type InitInput = ( ( utils: ReturnType<typeof getFetchUtils> ) => Promise<ArrayBuffer> ) | ArrayBuffer

export type InitCoreOptions = InitInput | { locateFile?: ( path: string ) => string }

export type InitOptions = {
	decode? : InitCoreOptions
	encode? : InitCoreOptions
}
type SharedCoreOptions = {
	fn       : ( ...args: Any ) => Promise<Any>
	path     : string
	version? : string
}
type CoreOptions = SharedCoreOptions & {
	libraryName : string
	/**
	 * Compile the WASM file with `WebAssembly.compile` or return the ArrayBuffer
	 */
	compile?    : boolean
}
export const createCoreInitializer = ( data: CoreOptions ) => async ( opts?: InitCoreOptions ) => {

	const setUtils = ( ) => getFetchUtils( data.libraryName, data.path, data.version )

	const input =  typeof opts === 'function' ? await opts( setUtils( ) ) : opts
	// @ts-ignore
	if ( typeof input === 'object' && 'locateFile' in input ) await data.fn( null, input )
	else if ( input instanceof ArrayBuffer ) await data.fn( data.compile ? await WebAssembly.compile( input ) : input )
	else await data.fn( input )

}

export const createInitializer = ( data: {
	libraryName : string
	decode      : SharedCoreOptions
	encode      : SharedCoreOptions
} ) => async ( opts?: InitOptions ) => {

	const setUtils = ( p:string, v?:string ) => getFetchUtils( data.libraryName, p, v )

	if ( opts?.decode ) {

		const input =  typeof opts?.decode === 'function' ? await opts?.decode( setUtils( data.decode.path, data.decode.version ) ) : opts?.decode

		// @ts-ignore
		if ( typeof input === 'object' && 'locateFile' in input ) await data.decode.fn( null, input )
		else if ( input instanceof ArrayBuffer ) await data.decode.fn( await WebAssembly.compile( input ) )
		else await data.decode.fn( input )

	}

	if ( opts?.encode ) {

		const input =  typeof opts?.encode === 'function' ? await opts?.encode( setUtils( data.encode.path, data.encode.version ) ) : opts?.encode
		// @ts-ignore
		if ( typeof input === 'object' && 'locateFile' in input ) await data.encode.fn( null, input )
		else if ( input instanceof ArrayBuffer ) await data.encode.fn( await WebAssembly.compile( input ) )
		else await data.encode.fn( input )

	}

}

