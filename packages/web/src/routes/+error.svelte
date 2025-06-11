<script lang="ts">

	import '../styles/error.css'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { ICON } from '$lib/icons'

	import { userState } from '$appstate'
	import { Button } from '$components'

</script>

<section class="error-page">

	<div class="content">
		{#if page.status === 404}
			<h1>We're sorry, that page no longer exists.</h1>
			<span class="error-code">404</span>
		{:else}
			<h1>Something went wrong.</h1>
			<span class="error-code">{page.status}</span>
		{/if}
	</div>

	<div class="btn-group">

		<Button
			class="btn small"
			icon={ICON.HOME}
			onclick={() => goto( '/' )}
			text="Go to home"
		/>
		<Button
			class="btn secondary small"
			icon={ICON.COMPRESS}
			onclick={() => userState.showExtra = true}
			text="Compress files"
		/>
	</div>

</section>
