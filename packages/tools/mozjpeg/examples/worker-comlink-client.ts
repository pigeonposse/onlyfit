import * as Comlink from 'https://unpkg.com/comlink/dist/esm/comlink.mjs'

import Worker from './worker-comlink.js?worker' // Esto depende de tu bundler (esto funciona con Vite)

const worker = new Worker()
const {
	compress, init, decode,
} = Comlink.wrap( worker )

export const workerComlinkMode = () => ( {
	compress,
	init,
	decode,
} )
