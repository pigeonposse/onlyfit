import { compress } from './browser'
// import { compress } from '../dist/browser.mjs'
import { css } from './code.example'
// CommonJS is also supported
// const { minify } = require('csso');

const minifiedCss = await compress( css )

console.log( minifiedCss )
