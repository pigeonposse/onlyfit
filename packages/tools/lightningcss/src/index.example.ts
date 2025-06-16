import { compress } from '.'
import { css }      from './code.example'

const uint8       = new TextEncoder().encode( css )
const minifiedCss = compress( uint8, {
	minify   : true,
	filename : 'index.css',
} )

console.log( new TextDecoder().decode( minifiedCss ) )
