import type { MimeType } from '@onlyfit/core'

import {
	dev,
	browser,
} from '$app/environment'

type CacheItem = {
	timestamp : number
	data      : string
}

type CacheOpts = {
	key  : string
	/**
	 * Time to live
	 *
	 * @default 24 * 60 * 60 * 1000 // 24h
	 */
	ttl? : number
}

export class Cache {

	#memory = new Map<MimeType, CacheItem>()
	#storage
	#opts

	constructor( opts: CacheOpts ) {

		this.#opts = {
			...opts,
			ttl : opts.ttl || 24 * 60 * 60 * 1000,
		}

		if ( !browser ) return

		this.#storage = window.sessionStorage

		const stored = this.#storage.getItem( opts.key )
		if ( stored ) {

			try {

				const obj = JSON.parse( stored ) as Record<string, CacheItem>
				for ( const [ k, v ] of Object.entries( obj ) ) {

					this.#memory.set( k as MimeType, v )

				}

			}
			catch {

				if ( dev ) console.warn( 'Cache corrupted, clearing…' )
				this.#storage.removeItem( opts.key )

			}

		}

	};

	#isExpired( item: CacheItem ) {

		return Date.now() - item.timestamp > this.#opts.ttl

	}

	#save() {

		const obj: Record<string, CacheItem> = {}
		for ( const [ k, v ] of this.#memory.entries() ) {

			obj[k] = v

		}
		this.#storage?.setItem( this.#opts.key, JSON.stringify( obj ) )

	}

	get( type: MimeType ): string | undefined {

		const item = this.#memory.get( type )
		if ( item && !this.#isExpired( item ) ) {

			return item.data

		}

	}

	set( type: MimeType, data: string ) {

		const item: CacheItem = {
			timestamp : Date.now(),
			data,
		}
		this.#memory.set( type, item )
		this.#save()

	}

}
