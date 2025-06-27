<script lang="ts">

	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	import { userState } from '$appstate'
	import { Tabs } from '$components'
	import { List } from '$ui'

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

{#snippet list()}
	<ul class="stats !flex flex-col p-2">
		<li>
			{@render compressLink( 'All', '/' )}
		</li>
		{#each userState.compression.routes.value.filter( d => d.data.isGroup || d.data.isFeatured ) as data}
			<li>
				{@render compressLink( data.key, data.route )}
			</li>
		{/each}
	</ul>
{/snippet}

{#snippet extension()}
	<List.Root class={[ 'compression', userState.compression.data.files.length || page.error ? 'active' : '' ]}>
		{#each Object.entries( userState.compression.routes.grouped ) as ext}
			{#if ext[1]}
				<List.Item title={ext[0]}>
					{#each ext[1] as v}
						<button
							class="link"
							onclick={() => {

								goto( v.route )
								userState.showExtra = false

							}}
							type="button"
						>{v.key}</button>
					{/each}
				</List.Item>
			{/if}
		{/each}
	</List.Root>
{/snippet}

<h3 class="text-center my-4">Compressor Tools</h3>

<Tabs
	class="center"
	items={[
		{
			id    : 'list',
			name  : 'List',
			input : list,
		},
		{
			id    : 'extension',
			name  : 'Extension',
			input : extension,
		},
	]}
/>

