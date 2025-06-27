import { SharedState } from './shared/index.svelte'

import type { MimeType } from '@onlyfit/core'

import { Cache }     from '$utils'
import { mimetypes } from '$worker'

const cache = new Cache( { key: 'mine-type-info' } )
export class MimetypeState extends SharedState {

	async getInfo( type: MimeType ) {

		const result = $state<{
			state  : 'loading' | 'finished' | 'error'
			value? : string
		}>( {
			state : 'loading',
			value : undefined,
		} )
		const cached = cache.get( type )
		if ( cached ) {

			result.state = 'finished'
			result.value = cached
			return result

		}

		await mimetypes.init()

		result.state = 'loading'

		mimetypes.sendAndListen( { type }, event => {

			if ( event.data.status === 'FINISHED' ) {

				cache.set( type, event.data.data )
				result.value = event.data.data
				result.state = 'finished'

			}
			else result.state = 'finished'

		} )

		return result

	}

}
