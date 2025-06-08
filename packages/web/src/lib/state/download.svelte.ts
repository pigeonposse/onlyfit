import { SharedState } from './shared/index.svelte'

import {
	Download,
	type DownloadInput,
} from '$utils'

export class DownloadState extends SharedState {

	#download = new Download( { prefix: PKG.extra.id } )

	async file( i?:DownloadInput ) {

		await this._run( 'Error downloading file', this.#download.run(
			i,
			i instanceof File ? i.name : undefined ),
		)

	}

}
