import type { WorkerData } from './_shared'

import { core } from '$lib/core/onlyfit/_shared/core'

type PluginKeys = Parameters<typeof core['filter']['data']['get']>[0]
export type SendData = {
	id   : string
	type : PluginKeys
}
export type ReceivedData = true
export type HandlerData = WorkerData<ReceivedData>
