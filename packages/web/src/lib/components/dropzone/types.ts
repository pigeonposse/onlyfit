import type { Snippet }             from 'svelte'
import type { HTMLInputAttributes } from 'svelte/elements'

export type DropzoneProps = Omit<HTMLInputAttributes, 'type' | 'hidden' | 'ondrop' | 'onchange' | 'onclick'> & {
	input?      : HTMLInputElement
	isDragover? : boolean
	children?   : Snippet
	onclick?    : () => Promise<unknown> | unknown
	ondrop?     : ( files?: FileList ) => Promise<unknown> | unknown
	onchange?   : ( files?: FileList ) => Promise<unknown> | unknown
}
