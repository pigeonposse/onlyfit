<script lang="ts">

	import type { ButtonProps } from './types'

	let {
		onclick,
		class: Klass,
		text,
		icon,
		...rest
	}: ButtonProps = $props()

</script>

<button
	class={[
		'btn',
		Klass,
		rest['aria-label'] ? 'hint--top hint--rounded' : undefined,
	]}
	onclick={onclick}
	type="button"

	{...rest}
>
	{#if icon}
		<span class={icon}></span>
	{/if}
	{#if text}
		<span>{text}</span>
	{/if}

</button>
