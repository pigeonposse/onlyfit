<script lang="ts">

	import { JsonLd } from '@svaio/meta/svelte'

	import Compress from './compress.svelte'
	import { ALLOWED_TYPES_ALL } from './const'

	import { userState } from '$appstate'

	let { data } = $props()

	userState.compression.allowedTypes = new Set( ALLOWED_TYPES_ALL )

</script>

<!-- JSON-LD: This squema is designed for the home page or main entry point of the app. -->
<JsonLd {...data.jsonld} />
<Compress />
