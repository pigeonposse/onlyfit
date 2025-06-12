<script lang="ts">
	import { COMPRESS_ID } from '../const'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	import { userState } from '$appstate'

</script>

{#snippet compressLink( name: string, path: string )}
	<button
		class={[ 'link !p-2', page.url.pathname === path ? 'active' : '' ]}
		onclick={() => {

			goto( path )
			userState.showExtra = false

		}}
		type="button"
	>
		Compress <b>{name}</b>
	</button>
{/snippet}

<section>
	<h1>Compression Tools</h1>
	<ul class="!flex flex-col items-center gap-1 py-4">
		<li>
			{@render compressLink( 'All', '/' )}
		</li>
		{#each COMPRESS_ID as type}
			<li>
				{@render compressLink( type, `/compress/${type}` )}
			</li>
		{/each}
	</ul>
</section>
