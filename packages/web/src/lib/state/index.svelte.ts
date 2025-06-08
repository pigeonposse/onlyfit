import { CompressionState } from './compress.svelte'
import { DownloadState }    from './download.svelte'

import { notifications } from '$components'

class UserState {

	compression
	download
	notification

	constructor() {

		this.notification = notifications
		this.compression  = new CompressionState( { notifications: notifications } )
		this.download     = new DownloadState( { notifications: notifications } )

	}

}

export const userState = new UserState()
