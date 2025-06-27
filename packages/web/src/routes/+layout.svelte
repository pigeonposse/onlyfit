<script lang="ts">
	import {
		MetaTags,
		deepMerge,
	} from '@svaio/meta/svelte'
	import { onMount } from 'svelte'
	import { pwaAssetsHead } from 'virtual:pwa-assets/head'
	import { pwaInfo } from 'virtual:pwa-info'

	import '../styles'
	import Tools from './compress/tools.svelte'
	import { page } from '$app/state'
	import { ICON } from '$lib/icons'

	import { userState } from '$appstate'
	import {
		Button,
		Modal,
		NotificationToaster,
	} from '$components'
	import { Background } from '$ui'

	let { children } = $props()

	onMount( () => {

		console.log( LOGO_ASCII )

	} )

</script>

<svelte:head>
	{@html pwaInfo ? pwaInfo.webManifest.linkTag : ''}
	{#if pwaAssetsHead.themeColor}
		<meta
			name="theme-color"
			content={pwaAssetsHead.themeColor.content}
		/>
	{/if}
	{#each pwaAssetsHead.links as link}
		<link {...link} />
	{/each}
</svelte:head>

<MetaTags {...deepMerge( page.data.metaAll, page.data.meta )} />

<Background />

<header>
	{#if page.url.pathname !== '/'}
		<a href="/">
			<img
				class="brand"
				alt={PKG.extra.productName}
				src="/favicon.png"
			>
		</a>
		<a href="/">
			<span class="title">{PKG.extra.productName}</span>
		</a>
	{:else}
		<img
			class="brand"
			alt={PKG.extra.productName}
			src="/favicon.png"
		>
		<span class="title">{PKG.extra.productName}</span>
	{/if}

	{#if page.data.routeData?.key}
		<span class="subtitle">{page.data.routeData.key}</span>
	{/if}
</header>

<main class="container">

	<article>
		{@render children()}
	</article>

</main>
<section class="footer-btns">
	<Button
		class="transparent"
		aria-label="More tools"
		icon={ICON.EXTRA}
		onclick={() => userState.showExtra = true}
		type="button"
	/>
	<!-- <Button
		class="transparent"
		aria-label="More tools"
		icon="i-fa6-solid:question"
		onclick={() => userState.showExtra = true}
		type="button"
	/> -->
</section>

<Modal
	title="More Tools"
	bind:show={userState.showExtra}
>
	<Tools />
</Modal>

<footer class="footer">
	Made with
	<a
		class="heart"
		href={PKG.extra.collective.funding}
		target="_blank"
	>
		♥
	</a>
	by
	<a
		class="link"
		href={PKG.extra.collective.web}
		target="_blank"
	>
		{PKG.extra.collective.name}
	</a>
</footer>

<div class="information">
	<span
		class="hint--bottom-left hint--rounded hint--large"
		aria-label="Compress your files with different tools. Compatible with a wide variety of formats, you can reduce the size of images, videos, audio files, and documents, directly from your browser."
	>
		<span class={ICON.HELP}></span>
	</span>
</div>

<section id="overlays">
	<NotificationToaster />
</section>
