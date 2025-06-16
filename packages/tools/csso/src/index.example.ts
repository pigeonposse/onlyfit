import { compress } from '.'
import { css }      from './code.example'
// CommonJS is also supported
// const { minify } = require('csso');

const minifiedCss = compress( css, { comments: false } )

console.log( minifiedCss )
