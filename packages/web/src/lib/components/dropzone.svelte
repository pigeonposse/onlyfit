<script lang="ts">

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
	ondragenter={e => {

		e.preventDefault()
		isDragover = true

	}}
	ondragleave={e => {

		e.preventDefault()
		isDragover = false

	}}
	ondragover={e => {

		e.preventDefault()
		isDragover = true

	}}
	ondrop={async e => {

		e.preventDefault()

		const files = e.dataTransfer?.files
		await ondrop?.( files )

		isDragover = false

	}}
	onkeydown={e => {

		if ( e.key === 'Enter' || e.key === ' ' ) {

			e.preventDefault()
			onclickFN()

		}

	}}
	role="button"
	tabindex="0"
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

