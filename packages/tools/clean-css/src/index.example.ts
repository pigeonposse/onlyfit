import { css }      from './code.example'
import { compress } from './index'

// import { compress } from '../dist/index.mjs'

const minifiedCss = await compress( css )

console.log( minifiedCss )
