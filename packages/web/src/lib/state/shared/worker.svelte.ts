import {
	WORKER_STATUS,
	type WorkerStatus,
} from '$worker'

export const createWorkerState = <Value>() => {

	const result = $state<{
		status : WorkerStatus
		value? : Value
	}>( {
		status : WORKER_STATUS.LOADING,
		value  : undefined,
	} )
	return {
		const : WORKER_STATUS,
		state : result,
	}

}
