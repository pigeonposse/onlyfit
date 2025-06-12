
import type { MetaTags }       from '@svaio/meta/svelte'
import type { ComponentProps } from 'svelte'

export const load = () => {

	const meta: ComponentProps<typeof MetaTags> = {
		title       : `Compression Tools | ${PKG.extra.productName}`,
		description : `Optimize and compress your files easily and client-side.`,
	}
	return { meta }

}

