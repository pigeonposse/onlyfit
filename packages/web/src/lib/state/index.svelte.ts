import { CompressionState } from './compress.svelte'
import { ConvertState }     from './convert.svelte'
import { DownloadState }    from './download.svelte'
import { MimetypeState }    from './mimetype.svelte'

import { notifications } from '$components'

class UserState {

	compression
	download
	notification
	showExtra
	mimetype
	conversion
	constructor() {

		this.notification = notifications
		this.compression  = new CompressionState( { notifications: notifications } )
		this.download     = new DownloadState( { notifications: notifications } )
		this.mimetype     = new MimetypeState( { notifications: notifications } )
		this.conversion   = new ConvertState( { notifications: notifications } )

		this.showExtra = $state( false )

	}

	_dropzoneInput : HTMLInputElement | undefined = $state( undefined )
	dropzone = { click: () => this._dropzoneInput?.click() }

}

export const userState = new UserState()
