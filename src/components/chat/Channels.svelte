<script lang="ts">
	import { Exit, Plus } from '$components/icons';
	import { UserStore } from '$lib/stores';
	import { portal } from 'svelte-portal';
	import { fade } from 'svelte/transition';

	import Avatar from './Avatar.svelte';

	let startJoin = true;
	let joining = false;
	let joinId = '';

	const joinChannel = async () => {
		console.log('joinChannel', joinId, startJoin, parseInt(joinId), !isNaN(parseInt(joinId)));

		if (joining) return;
		let idNum = parseInt(joinId);
		if (isNaN(idNum)) return;

		joining = true;
		const result = await UserStore.crud.channels.add(idNum);
		if (result) {
			joinId = '';
		}
		joining = false;
	};

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
				startJoin = true;
			}}
		>
			<Plus size={24} />
		</button>
		{#if startJoin}
			<div
				out:fade={{ duration: 100 }}
				in:fade={{ duration: 100 }}
				use:portal={'#chat'}
				class="absolute z-[1] flex h-full w-full flex-none items-center justify-center"
				hidden
			>
				<button
					class="h-full w-full cursor-default bg-black/70"
					on:click={() => {
						startJoin = false;
					}}
				/>
				<div class="shadow-lg absolute flex flex-col rounded-lg bg-overlay p-4">
					<div class="mb-2 flex flex-none justify-between">
						<h2 class="text-2xl font-bold text-default">Join Channel</h2>
						<button
							class="text-muted"
							on:click={() => {
								startJoin = false;
							}}
						>
							<Exit size={24} />
						</button>
					</div>
					<p class="text-gray-700 mb-4 text-default">Enter the channel ID below to join:</p>
					<input
						type="text"
						class="m-0 mb-4 rounded border border-subtle bg-dark p-2.5 text-default"
						placeholder="Channel ID"
						bind:value={joinId}
					/>
					<div class="flex items-center justify-between">
						<button
							class="focus:shadow-outline rounded-lg 
							px-2 py-2 
							font-bold text-muted 
							transition-colors duration-200 hover:bg-dark focus:outline-none"
							on:click={() => {
								startJoin = false;
							}}
						>
							Cancel
						</button>
						<button
							class="text-white focus:shadow-outline efault text-d 
							rounded-lg bg-accent py-2 
							px-4 font-bold
							transition-colors duration-200 hover:bg-accent/70 focus:outline-none"
							on:click={joinChannel}
						>
							Join
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
