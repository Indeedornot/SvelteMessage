<script lang="ts">
	import { Plus } from '$components/icons';
	import { UserStore } from '$lib/stores';

	import Avatar from '../Avatar.svelte';
	import ChooseModal from './ChooseModal.svelte';

	let modalOpen = false;

	let switching = false;
	const switchChannel = async (id: number) => {
		if (switching || $UserStore?.lastChannelId === id) return;
		switching = true;
		await UserStore.crud.lastChannelId.update(id);
		switching = false;
	};
</script>

<div class="flex h-full w-[72px] flex-none bg-dark">
	<div class="flex h-full w-full flex-col items-center overflow-y-auto pt-1">
		{#each $UserStore?.channels ?? [] as channel}
			<button class="mb-2 h-[48px] w-[48px] rounded-full bg-subtle" on:click={() => switchChannel(channel.id)}>
				<Avatar height={48} width={48} src={channel.avatar} />
			</button>
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
