<script lang="ts">
	export let width: number;
	export let height: number;

	export let src: string;
	export let rounded = true;
</script>

<div class="bg-subtle" class:rounded-full={rounded} style={`width: ${width}px; height: ${height}px;`}>
	{#if src}
		<img src={src} width={width} height={height} class:rounded-full={rounded} />
	{/if}
</div>
