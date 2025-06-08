
<script lang="ts">

	import { flip } from 'svelte/animate'
	import { fly } from 'svelte/transition'

	import Notification from './main.svelte'
	import { notifications } from './use'

	import type { HTMLAttributes } from 'svelte/elements'

	let { ...rest }: HTMLAttributes<HTMLDivElement> = $props()

</script>

<div
	class={[
		'toaster',
		!$notifications.length && 'hidden',
		rest.class,
	]}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	{#each $notifications as notification ( notification.id )}

		<div
			onmouseenter={() => notifications.pause( notification.id )}
			onmouseleave={() => notifications.resume( notification.id )}
			transition:fly={{ y: -30 }}
			animate:flip
		>
			<Notification
				id={notification.id}
				type={notification.type}
			>
				<p>{notification.message}</p>
				<!-- <Button
					class="small dark absolute top-2 bottom-2 right-3"
					icon="i-fa6-solid:xmark"
					onclick={() => notifications.remove( notification.id )}
				/> -->
			</Notification>

		</div>
	{/each}
</div>

