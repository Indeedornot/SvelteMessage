<script lang="ts">
	import { type UserStatus, getStatusColor } from '$lib/models';

	export let width: number;
	export let height: number;

	export let src: string | undefined;
	export let status: UserStatus | undefined = undefined;

	export let rounded = true;
</script>

<div
	class="grid bg-subtle child:col-start-1 child:row-start-1"
	class:rounded-full={rounded}
	style={`width: ${width}px; height: ${height}px;`}
>
	{#if src}
		<img src={src} width={width} height={height} class:rounded-full={rounded} />
	{/if}
	{#if status}
		<div class="mr-[1px] mb-[1px] h-[30%] w-[30%] place-self-end rounded-full bg-{getStatusColor(status)}" />
	{/if}
</div>
