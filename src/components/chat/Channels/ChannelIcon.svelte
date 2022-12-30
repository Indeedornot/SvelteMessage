<script lang="ts">
	import ContextMenu from '$components/chat/Channels/Menu/ContextMenu.svelte';
	import type { ChannelData } from '$lib/models';

	import Avatar from '../Avatar.svelte';

	export let channel: ChannelData;
	export let switchChannel: (id: number) => void;

	let contextMenu = {
		position: { x: 0, y: 0 },
		show: false
	};
</script>

<div class="mb-2 h-[48px] w-[48px]">
	<button
		class="rounded-full bg-subtle"
		on:click={() => switchChannel(channel.id)}
		on:contextmenu={(e) => {
			e.preventDefault();
			contextMenu.show = true;
			contextMenu.position = {
				x: e.clientX,
				y: e.clientY
			};
		}}
	>
		<Avatar height={48} width={48} src={channel.avatar} />
	</button>

	{#if contextMenu.show}
		<ContextMenu channel={channel} position={contextMenu.position} bind:show={contextMenu.show} />
	{/if}
</div>
