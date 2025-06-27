/* eslint-disable camelcase */
import {
	WORKER_STATUS,
	WorkerInstance,
	type WorkerStatus,
} from './_shared'

import type {
	HandlerData as I_HandlerData,
	SendData as I_SendData,
} from './init.types'
import type {
	HandlerData as M_HandlerData,
	SendData as M_SendData,
} from './mimetype.types'
import type {
	HandlerData as O_HandlerData,
	SendData as O_SendData,
} from './optimize.types'

export const mimetypes = new WorkerInstance<M_SendData, M_HandlerData>(
	() => import( '$worker/mimetype?worker' ),
)
export const optimize = new WorkerInstance<O_SendData, O_HandlerData>(
	() => import( '$worker/optimize?worker' ),
)
export const init = new WorkerInstance<I_SendData, I_HandlerData>(
	() => import( '$worker/init?worker' ),
)
export { WORKER_STATUS }
export type { WorkerStatus }
