import { CompressionState } from './compress.svelte'
import { DownloadState }    from './download.svelte'

import { notifications } from '$components'

class UserState {

	compression
	download
	notification
	showExtra
	constructor() {

		this.notification = notifications
		this.compression  = new CompressionState( { notifications: notifications } )
		this.download     = new DownloadState( { notifications: notifications } )
		this.showExtra    = $state( false )

	}

}

export const userState = new UserState()
