<script lang="ts">

	import { NOTIFICATION_TYPE } from './const'

	import type { NotificationType } from './types'
	import type { Snippet } from 'svelte'
	import type { HTMLAttributes } from 'svelte/elements'

	let {
		id = '',
		type = NOTIFICATION_TYPE.info,
		children,
		class: klass,
		...rest
	}: HTMLAttributes<HTMLDivElement> & {
		id?       : string
		type?     : NotificationType
		children? : Snippet
	} = $props()

	const icon = {
		[NOTIFICATION_TYPE.error]   : 'i-fa6-solid:circle-exclamation',
		[NOTIFICATION_TYPE.warn]    : 'i-fa6-solid:triangle-exclamation',
		[NOTIFICATION_TYPE.success] : 'i-fa6-solid:circle-check',
		[NOTIFICATION_TYPE.info]    : 'i-fa6-solid:circle-info',
	}

</script>

<div
	{id}
	role="alert"
	{...rest}
	class={[
		'notification',
		type,
		klass,
	]}
>
	<span class={[ 'notification__icon', icon[type] ]}></span>
	<div class="notification__content">
		{@render children?.()}
	</div>

</div>
