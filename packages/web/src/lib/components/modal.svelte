<script lang="ts">
	import {
		type Snippet,
		createEventDispatcher,
	} from 'svelte'

	// Definición de tipos para las propiedades (Props) del componente
	interface ModalProps {
		show                 : boolean
		title?               : string
		closeOnEscape?       : boolean
		closeOnOverlayClick? : boolean
		children?            : Snippet
		footer?              : Snippet
		closable?            : boolean
	}

	let {
		show = $bindable( false ),
		title,
		closeOnEscape = true,
		closeOnOverlayClick = true,
		closable = false,
		children,
		footer,
	}: ModalProps = $props()

	type ModalEvents = { close: void }
	const dispatch = createEventDispatcher<ModalEvents>()

	let modalElement: HTMLElement | undefined          = $state( undefined )
	let previousActiveElement: HTMLElement | undefined = $state( undefined )

	function trapFocus( e: KeyboardEvent ) {

		if ( !modalElement ) return

		const focusableElements = modalElement.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		)
		const firstFocusable    = focusableElements[0]
		const lastFocusable     = focusableElements[focusableElements.length - 1]

		if ( e.key === 'Tab' ) {

			if ( e.shiftKey ) {

				if ( document.activeElement === firstFocusable ) {

					lastFocusable.focus()
					e.preventDefault()

				}

			}
			else {

				if ( document.activeElement === lastFocusable ) {

					firstFocusable.focus()
					e.preventDefault()

				}

			}

		}

	}

	function closeModal() {

		show = false
		// previousActiveElement puede ser null o no tener .focus, se usa optional chaining
		previousActiveElement?.focus()
		dispatch( 'close' )

	}

	function handleOverlayClick() {

		if ( closeOnOverlayClick ) closeModal()

	}

	$effect( () => {

		if ( !closeOnEscape ) return

		const handleGlobalKeydown = ( event: KeyboardEvent ) => {

			if ( event.key === 'Escape' ) {

				closeModal()

			}

		}

		document.addEventListener( 'keydown', handleGlobalKeydown )

		return () => {

			document.removeEventListener( 'keydown', handleGlobalKeydown )

		}

	} )

	$effect( () => {

		if ( show && modalElement ) {

			requestAnimationFrame( () => {

				const firstFocusable = modalElement?.querySelector<HTMLElement>(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
				)
				// firstFocusable puede ser null, se usa optional chaining
				firstFocusable?.focus()

			} )

		}

	} )
</script>

{#if show}
	<div
		class="modal-overlay"
		aria-labelledby="modal-title"
		aria-modal="true"
		onclick={handleOverlayClick}
		role="dialog"
		tabindex="-1"
	>
		<div
			bind:this={modalElement}
			class="modal-content"
			onclick={e => e.stopPropagation()}
			onkeydown={trapFocus}
			role="document"
		>
			{#if closable || title}

				<header class="modal-header">

					{#if title}
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
{/if}

