<script lang="ts">

	import { Seo } from '@svaio/meta/svelte'
	import { pwaAssetsHead } from 'virtual:pwa-assets/head'
	import { pwaInfo } from 'virtual:pwa-info'

	import '../styles'
	import { page } from '$app/state'
	import { ICON } from '$lib/icons'
	import { COMPRESS_TYPE } from '$lib/state/const'

	import { userState } from '$appstate'
	import {
		Button,
		Modal,
		NotificationToaster,
	} from '$components'

	let { children } = $props()

</script>

<Seo
	meta={{
		title       : `${PKG.extra.productName} - ${PKG.extra.shortDesc}`,
		description : PKG.extra.shortDesc,
	}}
/>

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

<main class="container">
	<header>

		{#if page.data.type}
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
			<span class="subtitle">{page.data.type}</span>
		{:else}
			<img
				class="brand"
				alt={PKG.extra.productName}
				src="/favicon.png"
			>
			<span class="title">{PKG.extra.productName}</span>
		{/if}
	</header>

	<article>
		{@render children()}
	</article>
	<section class={[ 'compression', userState.compression.data.files.length ? 'active' : '' ]}>
		<div class="bar"></div>
		<div class="content">
			<ul class="formats">
				<li>
					<h3>Images</h3>
					<span>
						JPG, PNG, GIF, BMP, TIFF, WEBP, SVG
					</span>
				</li>
				<li>
					<h3>Video</h3>
					<span>
						MP4, MOV, AVI, MKV, WMV, FLV, WEBM, M4V, 3GP, MPEG
					</span>
				</li>
				<li>
					<h3>Audio</h3>
					<span>
						MP3, WAV, OGG, M4A, AAC, FLAC, WMA, AIFF
					</span>
				</li>
				<li>
					<h3>Documents</h3>
					<span>
						PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ODT, ODS, ODP, HTML
					</span>
				</li>
			</ul>
		</div>
	</section>

</main>
<section class="footer-btns">
	<Button
		class="transparent"
		aria-label="More tools"
		icon={ICON.EXTRA}
		onclick={() => userState.showExtra = true}
		type="button"
	/>
</section>

<Modal bind:show={userState.showExtra}>
	<h3 class="text-center my-4">More Tools</h3>
	<ul class="stats !flex flex-col p-2">
		{#each COMPRESS_TYPE as type}
			<li>
				<a
					class="link !p-2"
					href={`/compress/${type}`}
				>
					Compress <b>{type}</b>
				</a>
			</li>

		{/each}
	</ul>
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
		aria-label="Compress your files without losing quality. Compatible with a wide variety of formats, you can reduce the size of images, videos, audio files, and documents in seconds, directly from your browser."
	>
		<span class={ICON.HELP}></span>
	</span>
</div>

<section id="overlays">
	<NotificationToaster />
</section>
