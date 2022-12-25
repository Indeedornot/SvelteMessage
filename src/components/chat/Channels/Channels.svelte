<script lang="ts">
	import { Plus } from '$components/icons';
	import { UserStore } from '$lib/stores';

	import Avatar from '../Avatar.svelte';
	import Channel from './Channel.svelte';
	import ChooseModal from './ChooseModal.svelte';

	let modalOpen = false;

	let switching = false;
	const switchChannel = async (id: number) => {
		if (switching || $UserStore?.currChannel?.id === id) return;
		switching = true;
		await UserStore.crud.currChannel.update(id);
		switching = false;
	};
</script>

<div class="flex h-full w-[72px] flex-none bg-dark">
	<div class="flex h-full w-full flex-col items-center overflow-y-auto pt-1">
		{#each $UserStore?.channels ?? [] as channel}
			<Channel channel={channel} switchChannel={switchChannel} />
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
