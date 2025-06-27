<script lang="ts">

	import type { SectionListProps } from './types'

	let {
		class: klass,
		children,
		...rest
	}: SectionListProps = $props()

</script>

<section
	class={[ 'section', klass ]}
	{...rest}
>
	<div class="content">
		<ul class="list">
			{@render children?.( )}
		</ul>
	</div>
</section>
