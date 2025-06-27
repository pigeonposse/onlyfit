<script lang="ts">

	import type { KbdProps } from './types'

	let {
		value,
		class: klass,
		...rest
	}: KbdProps = $props()

	value = value.trim().toLowerCase()
	value = value.startsWith( 'key' ) ? value.slice( 3 ) : value

</script>

<kbd
	{...rest}
	class={[ 'kbd', klass ]}
>

	{#if value === 'cmd' || value === '⌘' || value === 'command'}
		⌘
		<!-- {:else if value === 'shift'}
		⇧ shift
	{:else if value === 'alt'}
		alt ⌥ -->
	{:else if value === 'comma'}
		,
	{:else}
		{value}
	{/if}

</kbd>

