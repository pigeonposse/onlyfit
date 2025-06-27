import type { ButtonProps }        from '$components'
import type { RenderContentProps } from '../_shared/types'
import type { HTMLAttributes }     from 'svelte/elements'

type Item = {
	id        : string
	name      : string
	input     : RenderContentProps['input']
	props?    : RenderContentProps['props']
	btnProps? : Omit<ButtonProps, 'href'>
	desc?     : string
	type?     : 'text' | 'main' | 'none'
	href?     : string
}

export type TabsProps = HTMLAttributes<HTMLDivElement> & {
	items         : Item[]
	id?           : string
	icon?         : string
	activeTabId?  : string
	contentClass? : string
	headerClass?  : string
	btnsClass?    : string
	urlParams?    : boolean
	defaultItem?  : string
}
