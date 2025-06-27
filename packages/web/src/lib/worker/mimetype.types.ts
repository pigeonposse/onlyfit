import type { WorkerData } from './_shared'
import type { MimeType }   from '@onlyfit/core'

export type SendData = {
	id    : string
	type? : MimeType
}
export type ReceivedData = string
export type HandlerData = WorkerData<ReceivedData>
