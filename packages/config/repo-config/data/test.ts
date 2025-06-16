type ErrorEntry = {
	id      : string
	message : string
}

export class ErrorState {

	value : ErrorEntry[] = $state( [] )

	remove( id: string ) {

		this.value = this.value.filter( e => e.id !== id )

	}

	add( error: unknown, fallback = 'Unexpected Error' ) {

		const message = error instanceof Error
			? error.message
			: typeof error === 'string'
				? error
				: fallback
		const id      = crypto.randomUUID()
		this.value    = [
			...this.value,
			{
				id,
				message,
			},
		]

		setTimeout( () => this.remove( id ), 10000 )

	}

}
