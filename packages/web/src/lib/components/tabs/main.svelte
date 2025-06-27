<script lang="ts">

	import { afterNavigate } from '$app/navigation'
	import RenderContent from '$components/_shared/render.svelte'
	import { URLParams } from '$components/_shared/url'

	import type { TabsProps } from './types'

	import { Button } from '$components'

	let {
		items,
		id,
		contentClass,
		headerClass,
		btnsClass,
		urlParams = false,
		defaultItem = items[0].id,
		activeTabId = $bindable( defaultItem ),
		...rest
	}: TabsProps = $props()

	const params = URLParams( {
		key          : id,
		values       : items.map( item => item.id ),
		defaultValue : defaultItem,
	} )

	const handleClick = ( tabId: string ) => () => {

		activeTabId = tabId
		if ( !urlParams ) return
		params.updateTo( tabId )

	}

	afterNavigate( () => {

		if ( !urlParams ) return
		const value = params.get()
		activeTabId = value || defaultItem

	} )

</script>

<div
	{...rest}
	class={[ 'tabs', rest.class ]}
>

	<div class={[ 'tabs--header', headerClass ]}>
		{#each items as item ( item.id )}
			<Button
				{...{
					'class'      : [ btnsClass, activeTabId === item.id && 'active' ],
					'disabled'   : activeTabId === item.id,
					'text'       : item.name,
					'aria-label' : item.desc,
					...( item.href ? { href: item.href } : { onclick: handleClick( item.id ) } ),
					...item.btnProps,
				}}
			/>
		{/each}
	</div>

	{#each items as item ( item.id )}
		{#if activeTabId === item.id}
			<div
				class={[
					item.type === 'none' ? '' : 'tabs--content',
					item.type,
					contentClass,
				]}
			>

				<RenderContent
					input={item.input}
					props={item.props}
				/>
			</div>
		{/if}
	{/each}
</div>

