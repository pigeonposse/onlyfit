import { CoreOptions }     from './types'
import { allUtils }        from '../utils'
import { getMimetypeData } from './mime'

export class CoreSuper<Keys extends string> {

	plugins : Map<Keys, CoreOptions<Keys>['plugin'][Keys]> = new Map()
	utils   : typeof allUtils = allUtils

	constructor( opts: CoreOptions<Keys> ) {

		if ( !opts.debug ) console.debug = () => {}

		for ( const key in opts.plugin )
			this.plugins.set( key, opts.plugin[key] )

	}

	getMimetypeData = getMimetypeData

}
