<script lang="ts">
	import { dragdrop } from '../actions'

	import type { DropzoneProps } from './types'

	let {
		input = $bindable( ),
		isDragover = $bindable( false ),
		children,
		class: Klass,
		onclick,
		onchange,
		ondrop,
		...rest
	}: DropzoneProps = $props()
	const onclickFN = async () => {

		if ( input ) {

			input.value = ''
			input.click()

		}
		await onclick?.( )

	}
</script>

<div
	class={[
		'dropzone',
		!isDragover || 'dragover',
		Klass,
	]}
	onclick={() => onclickFN()}

	onkeydown={e => {

		if ( e.key === 'Enter' || e.key === ' ' ) {

			e.preventDefault()
			onclickFN()

		}

	}}
	role="button"
	tabindex="0"
	use:dragdrop={{
		ondragover : v => isDragover = v,
		ondrop,
	}}
>
	<input
		bind:this={input}

		hidden
		multiple

		{...rest}
		onchange={async e => {

			// @ts-ignore
			const files = e.target?.files as FileList
			await onchange?.( files )

		}}
		type="file"
	/>

	{@render children?.()}

</div>

