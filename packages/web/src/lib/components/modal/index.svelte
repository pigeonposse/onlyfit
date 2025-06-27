<script lang="ts">

	import type { ModalProps } from './types'

	import { portal } from '$components'

	let {
		show = $bindable( false ),
		title,
		closeOnEscape = true,
		closeOnOverlayClick = true,
		closable = false,
		children,
		footer,
		showTitle = false,
		class: klass,
		...rest
	}: ModalProps = $props()

	let modalElement: HTMLElement | undefined = $state( undefined )

	const closeModal = () => show = false

	function handleOverlayClick() {

		if ( closeOnOverlayClick ) closeModal()

	}

	$effect( () => {

		if ( !closeOnEscape ) return

		const handleGlobalKeydown = ( event: KeyboardEvent ) => {

			if ( event.key === 'Escape' ) closeModal()

		}

		document.addEventListener( 'keydown', handleGlobalKeydown )

		return () =>
			document.removeEventListener( 'keydown', handleGlobalKeydown )

	} )

</script>

<div
	class={[ 'modal', klass ]}
	aria-labelledby={title || 'modal-title'}
	aria-modal={show}
	onclick={handleOverlayClick}
	role="dialog"
	tabindex="-1"
	use:portal={'#overlays'}
	{...rest}
>
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={modalElement}
		class="modal-content"
		onclick={e => e.stopPropagation()}
		onkeydown={e => e.stopPropagation()}
		role="document"
	>
		{#if closable || ( title && showTitle )}

			<header class="modal-header">

				{#if title && showTitle}
					<h2 id="modal-title">{title}</h2>
				{:else}
					<div></div>
				{/if}
				{#if closable}

					<button
						class="modal-close-button"
						aria-label="Cerrar modal"
						onclick={closeModal}
						type="button"
					>
						&times;
					</button>
				{/if}
			</header>
		{/if}
		<div class="modal-body">
			{@render children?.()}
		</div>
		{#if footer}
			<footer class="modal-footer">
				{@render footer()}
			</footer>
		{/if}
	</div>
</div>

