import type { notifications } from '$components'

export type SharedStateProps = { notifications: typeof notifications }

export class SharedState {

	_not
	loading : boolean | undefined = $state()

	constructor( { notifications } :SharedStateProps ) {

		this._not = notifications

	}

	protected async _run<T>( title:string, cb: Promise<T> ) {

		try {

			this.loading = true
			const res    = await cb
			this.loading = false
			return res

		}
		catch ( e ) {

			this.loading = false
			this._not.sendError( title, e )

		}

	}

}
