<script lang="ts">
	import { Exit } from '$components/icons';
	import { portal } from 'svelte-portal';
	import { fade } from 'svelte/transition';

	import CreateModal from './CreateModal.svelte';
	import JoinModal from './JoinModal.svelte';

	export let open: boolean;
	let modal = {
		join: {
			open: false,
			pending: false,
			data: {
				channelId: ''
			}
		},
		create: {
			open: false,
			pending: false,
			data: {
				name: '',
				avatar: ''
			}
		}
	};

	const closeModal = () => {
		if (modal.join.pending || modal.create.pending) return;
		modal.join.open = false;
		modal.create.open = false;
		open = false;
	};
</script>

{#if open}
	<div
		out:fade={{ duration: 100 }}
		in:fade={{ duration: 100 }}
		use:portal={'#chat'}
		class="absolute z-[1] flex h-full w-full flex-none items-center justify-center"
		hidden
	>
		<button class="h-full w-full cursor-default bg-black/70" on:click={closeModal} />
		{#if !modal.join.open && !modal.create.open}
			<div class="absolute w-full max-w-md overflow-hidden rounded-lg bg-overlay pb-4 pt-2 transition-all">
				<div class="flex flex-none items-center justify-between px-6 pt-5">
					<div class="text-2xl font-bold leading-none text-emphasis">Choose an option</div>
					<button
						class="text-muted hover:text-default"
						on:click={() => {
							open = false;
						}}
					>
						<Exit size={24} />
					</button>
				</div>

				<div class="py-5 px-7 leading-relaxed text-default">
					<span class="font-semibold">Welcome!</span>
					<p class="ml-1">
						Would you like to create your own community?
						<br /> Or maybe you have an invite?
					</p>
				</div>

				<div class="flex flex-col gap-4 px-2 pb-3 pt-1">
					<button
						type="button"
						class="mx-3 justify-center rounded-md 
                        border-0 bg-green-500 px-4 py-3 
                        font-medium leading-6 text-emphasis 
                        hover:bg-green-600 focus:outline-none active:bg-green-800"
						on:click={() => {
							modal.create.open = true;
						}}
					>
						Create server
					</button>
					<button
						type="button"
						class="mx-3 justify-center rounded-md 
                            border-0 bg-blue-500 px-4 py-3 
                            font-medium leading-6 text-emphasis 
                            hover:bg-blue-600 hover:text-default focus:outline-none active:bg-blue-800"
						on:click={() => {
							modal.join.open = true;
						}}
					>
						Join server
					</button>
				</div>

				<span class="ml-4 flex w-full flex-none rounded-md">
					<button
						class="focus:shadow-outline rounded-lg 
							px-2 py-2 
							font-bold text-muted 
							hover:underline focus:outline-none"
						on:click={closeModal}
					>
						Cancel
					</button>
				</span>
			</div>
		{:else if modal.join.open}
			<JoinModal bind:join={modal.join} closeModal={closeModal} />
		{:else if modal.create.open}
			<CreateModal bind:create={modal.create} closeModal={closeModal} />
		{/if}
	</div>
{/if}
