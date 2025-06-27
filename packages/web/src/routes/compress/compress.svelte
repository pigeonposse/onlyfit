<script lang="ts">

	import { ICON } from '$lib/icons'

	import { userState } from '$appstate'
	import {
		Button,
		Dropzone,
		Modal,
	} from '$components'

	let dropzoneInput: HTMLInputElement | undefined = $state( undefined )
	let linkPopup: boolean                          = $state( false )

</script>

<!-- {#if userState.compression.data.files.length <= 0} -->
<Dropzone
	onchange={f => userState.compression.add( f )}
	ondrop={f => userState.compression.add( f )}
	bind:input={dropzoneInput}
>
	<div class="info">
		<span class="icon i-fa6-solid:folder-open"></span>
		<p>Drop files here or click to browse</p>
		<div class="absolute top-2 right-2 ">

			<Button
				class="dark small opacity-50 hover:opacity-100"
				aria-label="Attach link"
				icon={ICON.LINK}
				onclick={e => {

					e.stopPropagation()
					linkPopup = true

				}}
			/>
		</div>
	</div>

</Dropzone>

<Modal
	class="url"
	bind:show={linkPopup}
>
	<input
		onchange={e => {

			// @ts-ignore
			const v = e.target?.value as string
			if ( !v ) return
			userState.compression.addLink( v )
			linkPopup = false

		}}
		type="url"
	>
</Modal>

<!-- {/if} -->

{#if userState.compression.data.files.length > 0}
	<section class="stats-container">
		<ul class="stats">
			<li>
				<h3>Total Files</h3>
				<span>{userState.compression.data.total.files.count}</span>
			</li>
			<li>
				<h3>Original Size</h3>
				<span>{userState.compression.data.total.files.size.format}</span>
			</li>
			<li>
				<h3>Compressed Size</h3>
				<span>
					<span>{userState.compression.data.total.compressed.size.format}</span>
					{#if userState.compression.data.total.compressed.saved.bytes}
						<span style="font-size:0.5em;opacity:0.8;">( -{userState.compression.data.total.compressed.saved.format} )</span>
					{/if}
				</span>
			</li>

			<li>
				<h3>Space Saved</h3>
				<span>
					<span>{userState.compression.data.total.compressed.savedX100}</span>
				</span>
			</li>
		</ul>
	</section>
	<section class="files-container">
		<ul class="files-list">
			{#each userState.compression.data.files as value ( value.file.name )}
				<li class={[ 'file-item', value.compressed ? 'compressed' : undefined ]}>
					<div class="file-info">
						<div>
							{#await userState.compression.getThumbnail( value.file )}
								<object title="Preview: {value.file.name}">
									<span class={[ ICON.LOAD, 'spinner' ]}></span>
								</object>
							{:then image}
								<object
									data={image}
									title="Preview: {value.file.name}"
								>
									<span class={value.icon}></span>
								</object>
							{/await}
						</div>
						<div>
							<div class="file-name">{value.file.name}</div>
							<div class="file-size">{value.size.format}</div>
							<div class="file-size">{value.init.status} value: {value.init.value}</div>
							{#if value.compressed}
								<div class="file-size">{value.compressed.size.format} ({value.compressed.saved.x100})</div>
							{/if}
						</div>
					</div>
					<div class="btn-group">
						<Button
							class="small"
							aria-label={!value.allowed ? 'Compression not allowed' : 'Compress'}
							disabled={!value.allowed ? true : false}
							icon={ICON.COMPRESS}
							onclick={() => userState.compression.executeOne( value.file )}
						/>
						<Button
							class="secondary small"
							aria-label="Download"
							icon={ICON.DOWNLOAD}
							onclick={() => userState.download.file( value.compressed?.file || value.file )}
						/>
						<Button
							class="dark small"
							aria-label="Remove"
							icon={ICON.REMOVE}
							onclick={() => userState.compression.remove( value.file )}
						/>
					</div>
				</li>
			{/each}
		</ul>
	</section>

	{#if userState.compression.loading}
		<span class={[ ICON.LOAD, 'spinner' ]}></span>
	{/if}

	<section class="btn-group">
		<div>
			<Button
				class="dark"
				aria-label="Reset"
				icon={ICON.RESET}
				onclick={() => userState.compression.reset()}
			/>
			<Button
				class="dark"
				aria-label="Add more files"
				icon={ICON.MORE}
				onclick={() => dropzoneInput?.click()}
			/>
			<Button
				class="dark"
				aria-label="Configure"
				icon={ICON.CONFIG}
				onclick={() => dropzoneInput?.click()}
			/>
		</div>

		<Button
			icon={ICON.COMPRESS}
			onclick={() => userState.compression.execute()}
			text="Compress"
		/>
		<Button
			class="secondary"
			icon={ICON.DOWNLOAD}
			onclick={() => userState.download.file( userState.compression.output )}
			text="Download"
		/>

	</section>
{/if}
