import { deps } from './deps'

console.log( 'Number of resources dependencies:' )
// @ts-ignore
console.log( Object.keys( deps.resources ).length )
