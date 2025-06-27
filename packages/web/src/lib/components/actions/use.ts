import type { ActionReturn } from 'svelte/action'

export type ActionCallback<Ref extends ( HTMLElement | SVGElement )> = ( ref: Ref ) => ActionReturn

export const useActions = <Ref extends ( HTMLElement | SVGElement )>( node: Ref, callback?: ActionCallback<Ref> ) => {

	if ( !callback ) return

	return callback( node )

}
