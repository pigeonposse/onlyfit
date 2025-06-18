import { Graph } from '@dagrejs/graphlib'

import { mineUtils } from '../utils'
import { CoreData }  from './data'

import type { MimeType } from '../utils'

type Plugin<Keys extends string> = Awaited<ReturnType<CoreData<Keys>['get']>>
type CombinationOptions = {
	from   : MimeType
	to     : MimeType
	/**
	 * @default 10
	 */
	depth? : number
	/**
	 * Maximum number of combinations
	 *
	 * @default 100
	 */
	max?   : number
}
export class CoreFilters<Keys extends string> {

	constructor( public data: Map<Keys, Plugin<Keys>> ) {}

	async getConverterPlugin( opts: {
		from : MimeType
		to?  : MimeType
	} ) {

		const {
			from, to,
		} = opts

		for ( const [ key, value ] of this.data.entries() ) {

			const combinations = value.converter?.data?.combinations || []
			if ( combinations.find( c => to ? ( c.from === from && c.to === to ) : c.from === from ) ) return {
				key,
				value,
			}

		}

	}

	async getConverterPlugins( opts: {
		from : MimeType
		to?  : MimeType
	} ) {

		const {
			from, to,
		} = opts
		const res = new Map<Keys, Plugin<Keys>>()
		for ( const [ key, value ] of this.data.entries() ) {

			const combinations = value.converter?.data?.combinations || []
			if ( combinations.find( c => to ? ( c.from === from && c.to === to ) : c.from === from ) )
				res.set( key, value )

		}
		return res

	}

	async getOptimizerPlugin( opts: { type: MimeType } ) {

		const { type } = opts

		for ( const [ key, value ] of this.data.entries() ) {

			const mimetypes = value.data.optimizer?.mimetypes || []
			if ( mimetypes.includes( type ) ) return {
				key,
				value,
			}

		}

	}

	async getOptimizerPlugins( opts: { type: MimeType } ) {

		const { type } = opts
		const res      = new Map<Keys, Plugin<Keys>>()
		for ( const [ key, value ] of this.data.entries() ) {

			const mimetypes = value.data.optimizer?.mimetypes || []
			if ( mimetypes.includes( type ) ) res.set( key, value )

		}
		return res

	}

	async getConverterCombinations( opts: CombinationOptions ) {

		const {
			from, to, max: MAX_PATHS = 100, depth: MAX_DEPTH = 10,
		} = opts
		if ( !from || !mineUtils.existsType( from ) ) throw new Error( `Invalid from type: ${from}` )
		if ( !to || !mineUtils.existsType( to ) ) throw new Error( `Invalid to type: ${to}` )

		const graph = new Graph( { directed: true } )

		// Construir grafo
		for ( const [ key, plugin ] of this.data.entries() ) {

			const combinations = plugin.converter?.data?.combinations || []
			for ( const combo of combinations )
				graph.setEdge( combo.from, combo.to, {
					plugin : key,
					data   : combo,
				} )

		}

		const results: {
			plugin : Keys
			data: {
				from : MimeType
				to   : MimeType
			}
		}[][] = []

		type Step = {
			current : MimeType
			path: {
				plugin : Keys
				data: {
					from : MimeType
					to   : MimeType
				}
			}[]
			visited : Set<MimeType>
		}

		const stack: Step[] = [
			{
				current : from,
				path    : [],
				visited : new Set( [ from ] ),
			},
		]

		while ( stack.length > 0 && results.length < MAX_PATHS ) {

			const top = stack.pop()
			if ( !top ) continue

			const {
				current, path, visited,
			} = top

			if ( current === to ) {

				results.push( path )
				continue

			}

			if ( path.length >= MAX_DEPTH ) continue

			for ( const succ of graph.successors( current ) || [] ) {

				if ( visited.has( succ ) ) continue

				const edgeData = graph.edge( current, succ )

				stack.push( {
					current : succ,
					path    : [ ...path, edgeData ],
					visited : new Set( visited ).add( succ ),
				} )

			}

		}

		return results

	}

	async getConverterCombination( opts: Omit<CombinationOptions, 'max'> ) {

		const data = ( await this.getConverterCombinations( {
			...opts,
			max : 1,
		} ) )
		return data.length ? data[0] : undefined

	}

}
