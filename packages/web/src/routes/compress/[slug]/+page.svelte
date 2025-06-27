<script lang="ts">

	import Compress from '../compress.svelte'

</script>

<Compress />

<!--
<script lang="ts">

	import Compress from '../compress.svelte'

	import { ICON } from '$lib/icons'

	import { userState } from '$appstate'

	let { data } = $props()

</script>

{#if data.routeData.data.isExtension}
	{#await userState.mimetype.getInfo( data.routeData.data.mimeTypes[0] ) then data}
		{#if data.state === 'loading'}
			<span class={[ ICON.LOAD, 'spinner' ]}></span>
		{:else if data.state === 'finished'}
			<span>{data.value}</span>
		{:else}
			<span>Error loading mimetype</span>
		{/if}
	{/await}
{/if}

<Compress /> -->
