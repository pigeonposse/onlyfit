import { minify } from './browser'
import { html }   from './code.example'

const minified = await minify( html, {
	collapseWhitespace            : true,
	removeComments                : true,
	removeRedundantAttributes     : true,
	removeScriptTypeAttributes    : true,
	removeStyleLinkTypeAttributes : true,
} )

console.log( minified )
