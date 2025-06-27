<script lang="ts">

	import { JsonLd } from '@svaio/meta/svelte'

	import Compress from './compress/compress.svelte'

	import { userState } from '$appstate'

	let { data } = $props()

	userState.compression.allowedTypes = userState.compression.supported.mimetypes

</script>

<!-- JSON-LD: This squema is designed for the home page or main entry point of the app. -->
<JsonLd {...data.jsonld} />
<Compress />
