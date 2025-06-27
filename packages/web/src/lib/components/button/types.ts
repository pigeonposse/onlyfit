import type { HTMLButtonAttributes } from 'svelte/elements'

export type ButtonProps = HTMLButtonAttributes & {
	onclick? : NonNullable<HTMLButtonAttributes['on:click']>
	text?    : string
	icon?    : string
}
