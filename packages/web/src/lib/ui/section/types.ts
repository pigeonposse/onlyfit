import type { Snippet } from 'svelte'
import type {
	HTMLAttributes,
	HTMLLiAttributes,
} from 'svelte/elements'

export type SectionItemProps = HTMLLiAttributes & {
	title     : string
	desc?     : string
	children? : Snippet
}
export type SectionListProps = HTMLAttributes<HTMLElement> & { children?: Snippet }
