<script lang="ts">

	import { ICON } from '$lib/icons'
	import { userState } from '$lib/state/index.svelte'

	import {
		Button,
		Dropzone,
	} from '$components'
	import { getThumbnailFromFile } from '$utils'

	let dropzoneInput: HTMLInputElement
	const getFileIcon = ( file: File ): string => {

		const { type } = file

		if ( type === 'application/zip' || type === 'application/x-zip-compressed' ) return ICON.FILE_ZIP
		if ( type.startsWith( 'image/' ) ) return ICON.FILE_IMAGE
		if ( type.startsWith( 'video/' ) ) return ICON.FILE_VIDEO
		if ( type === 'application/pdf' ) return ICON.FILE_PDF

		const codeTypes = [
			'application/javascript',
			'text/javascript',
			'application/json',
			'text/typescript',
			'application/xml',
			'text/html',
			'text/css',
			'application/x-sh',
			'text/x-python',
		]

		return codeTypes.includes( type ) ? ICON.FILE_CODE : ICON.FILE

	}
</script>

<!-- {#if userState.compression.data.files.length <= 0} -->
<Dropzone
	onchange={f => userState.compression.add( f )}
	ondrop={f => userState.compression.add( f )}
	bind:input={dropzoneInput}
>
	<div class="icon">📁</div>
	<p>Drop files here or click to browse</p>
</Dropzone>
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
					<span>{userState.compression.data.total.compressed.saved.format}</span>
					{#if userState.compression.data.total.compressed.size.bytes}
						<span style="font-size:0.5em;opacity:0.8;">( -{userState.compression.data.total.compressed.size.format} )</span>
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
							{#await getThumbnailFromFile( value.file )}
								<object title="Preview: {value.file.name}">
									<span class={[ ICON.LOAD, 'spinner' ]}></span>
								</object>
							{:then image}
								<object
									data={image}
									title="Preview: {value.file.name}"
								>
									<span class={getFileIcon( value.file )}></span>
								</object>
							{/await}
						</div>
						<div>
							<div class="file-name">{value.file.name}</div>
							<div class="file-size">{value.size.format}</div>

							{#if value.compressed}
								<div class="file-size">{value.compressed.size.format} ({value.compressed.saved.x100})</div>
							{/if}
						</div>
					</div>
					<div class="btn-group">

						<Button
							class="small"
							aria-label="Compress"
							disabled={value.compressed ? true : false}
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
			onclick={() => dropzoneInput.click()}
		/>

		{#if userState.compression.output}
			<Button
				class="secondary"
				icon={ICON.DOWNLOAD}
				onclick={() => userState.download.file( userState.compression.output )}
				text="Download"
			/>
		{:else}
			<Button
				icon={ICON.COMPRESS}
				onclick={() => userState.compression.execute()}
				text="Compress"
			/>
		{/if}

	</section>
{/if}
