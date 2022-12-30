<script lang="ts">
	import { generateRandomAvatar } from '$lib/helpers/RandomAvatar';
	import { maxLength, singleLine } from '$lib/helpers/contentEditable';
	import { UserConstr } from '$lib/models';
	import { UserStore } from '$lib/stores';

	import Avatar from '../Avatar.svelte';

	export let newName: string;
	export let newAvatar: string;
	export let isUpdating: boolean;

	$: user = $UserStore;

	const generateAvatar = () => (newAvatar = generateRandomAvatar());
</script>

<div class="flex w-full">
	<button
		class="group relative grid rounded-full child:col-start-1 child:row-start-1"
		on:click={generateAvatar}
		disabled={isUpdating}
	>
		<Avatar width={32} height={32} src={newAvatar ?? user?.avatar} />
		<div
			class="h-[32px] w-[32px] rounded-full group-hover:bg-default/50 group-active:bg-dark/75"
			class:hidden={isUpdating}
		/>
	</button>
	<div class="ml-1.5 flex w-full flex-col gap-1 child:pr-1 child:pl-0.5">
		{#if !isUpdating}
			<span
				class="w-full break-all text-[14px] font-semibold leading-[18px] text-default outline-none"
				contenteditable="true"
				use:singleLine
				bind:textContent={newName}
				use:maxLength={{ maxLength: UserConstr.name.maxLength }}
			>
				{user?.name}
			</span>
		{:else}
			<span class="w-full break-all text-[14px] font-semibold leading-[18px] text-default">
				{newName}
			</span>
		{/if}

		<span class="text-[12px] leading-[16px] text-muted">{user?.id}</span>
	</div>
</div>
