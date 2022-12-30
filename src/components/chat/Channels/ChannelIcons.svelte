<script lang="ts">
	import { Plus } from '$components/icons';
	import { switchChannel as switchChannelApi } from '$lib/backend/Channels';
	import { ChannelStore, ChannelsCache } from '$lib/stores';

	import ChannelIcon from './ChannelIcon.svelte';
	import ChooseModal from './Modal/ChooseModal.svelte';

	let modalOpen = false;

	let switching = false;
	const switchChannel = async (id: number) => {
		if (switching || $ChannelStore?.id === id) return;
		switching = true;
		await switchChannelApi(id);
		switching = false;
	};
</script>

<div class=" flex h-full w-[72px] flex-none bg-dark">
	<div class="flex h-full w-full flex-col items-center overflow-y-auto pt-1">
		{#each $ChannelsCache as channel}
			<ChannelIcon channel={channel} switchChannel={switchChannel} />
		{/each}
		<button
			class="flex h-[48px] w-[48px] flex-none items-center justify-center rounded-full bg-subtle"
			on:click={() => {
				modalOpen = true;
			}}
		>
			<Plus size={24} />
		</button>
		<ChooseModal bind:open={modalOpen} />
	</div>
</div>
