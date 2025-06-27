import type { WorkerData } from './_shared'
import type { MimeType }   from '@onlyfit/core'

export type SendData = {
	id      : string
	buffer  : ArrayBuffer
	type    : MimeType
	// eslint-disable-next-line @stylistic/key-spacing, @typescript-eslint/no-explicit-any
	options: any
}
export type ReceivedData = {
	buffer : ArrayBuffer
	type   : MimeType
}
export type HandlerData = WorkerData<ReceivedData>
