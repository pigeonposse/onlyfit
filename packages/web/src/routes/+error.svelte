<script lang="ts">

	import '../styles/error.css'
	import { ICON } from '$lib/icons'

</script>

<section class="error-page">

	<div class="content">
		<h1>We're sorry, that page no longer exists.</h1>
		<span class="error-code">404</span>
	</div>

	<div class="btn-group">

		<a
			class="btn small"
			href="/"
		>
			<span class={ICON.HOME}></span>
			<span>Go to home</span>

		</a>
		<a
			class="btn secondary small"
			href="/"
		>
			<span class={ICON.COMPRESS}></span>
			<span>Compress files</span>
		</a>
	</div>

</section>
