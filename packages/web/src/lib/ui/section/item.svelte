<script lang="ts">

	import type { SectionItemProps } from './types'

	let {
		title,
		desc,
		class: klass,
		children,
		...rest
	}: SectionItemProps = $props()

</script>

<li
	class={[ 'item', klass ]}
	{...rest}
>
	{#if title}
		<h3>{title}</h3>
	{/if}

	{#if desc}
		<span>{desc}</span>
	{/if}

	<div>
		{@render children?.()}
	</div>
</li>

