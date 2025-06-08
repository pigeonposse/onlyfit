<script lang="ts">

	import { Seo } from '@svaio/meta/svelte'
	import { pwaAssetsHead } from 'virtual:pwa-assets/head'
	import { pwaInfo } from 'virtual:pwa-info'

	import '../styles'
	import { ICON } from '$lib/icons'

	import { NotificationToaster } from '$components'

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
		<!-- <enhanced:img
			class="brand"
			alt={PKG.extra.productName}
			src="/banner.png"
		/> -->
		<h1 class="hidden">{PKG.extra.productName}</h1>
		<img
			class="brand"
			alt={PKG.extra.productName}
			src="/banner.png"
		>
	</header>

	<article>
		{@render children()}
	</article>

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

</main>

<footer class="footer">
	Made with <span class="heart">♥</span> by <a
		href="https://pigeonposse.com"
		rel="noopener"
		target="_blank"
	>{PKG.extra.collective.name}</a>
</footer>
<div class="information">
	<span
		class="hint--bottom-left hint--rounded hint--large"
		aria-label="Compress your files without losing quality. Compatible with a wide variety of formats, you can reduce the size of images, videos, audio files, and documents in seconds, directly from your browser."
	>
		<span class={ICON.HELP}></span>
	</span>
</div>
<!-- {#if userState.error.value.length}
	<div class="toaster">
		{#each userState.error.value as e ( e.id )}
			<div class="error">{e.message}</div>
		{/each}
	</div>
{/if} -->

<section id="overlays">
	<NotificationToaster />
</section>
