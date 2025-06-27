import type { Snippet }        from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'

export type ModalProps = {
	show                 : boolean
	title?               : string
	showTitle?           : boolean
	closeOnEscape?       : boolean
	closeOnOverlayClick? : boolean
	children?            : Snippet
	footer?              : Snippet
	closable?            : boolean
} & HTMLAttributes<HTMLElement>
