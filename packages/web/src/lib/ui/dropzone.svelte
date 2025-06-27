<script lang="ts">

	import { ICON } from '$lib/icons'

	import type { ComponentProps } from 'svelte'

	import { userState } from '$appstate'
	import {
		Button,
		Dropzone,
		Modal,
	} from '$components'

	type DZ = Omit<ComponentProps<typeof Dropzone>, 'ondrop'>
	let {
		children,
		onchange,
		active = true,
		...rest
	}: DZ & { active?: boolean } = $props()

	let linkPopup: boolean = $state( false )

</script>

<!-- {#if userState.compression.data.files.length <= 0} -->
<Dropzone
	class={[ active ? 'active' : '' ]}
	onchange={f => onchange?.( f )}
	ondrop={f => onchange?.( f )}
	bind:input={userState._dropzoneInput}
	{...rest}
>
	<div class="info">
		<span class={[ 'icon', ICON.DROPZONE ]}></span>
		<p>Drop files here or click to browse</p>
		<div class="absolute top-2 right-2 ">

			<Button
				class="dark small"
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
<div class="content">
	{@render children?.()}
</div>
<Modal bind:show={linkPopup}>
	<input type="url">
</Modal>
