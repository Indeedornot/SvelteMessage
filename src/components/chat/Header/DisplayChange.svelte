<script lang="ts">
	import { generateRandomAvatar } from '$lib/helpers/RandomAvatar';
	import { maxLength, singleLine } from '$lib/helpers/contentEditable';
	import { UserConstr } from '$lib/models';
	import { UserStore } from '$lib/stores';

	import Avatar from '../Avatar.svelte';

	export let newName: string;
	export let newAvatar: string;

	const generateAvatar = () => {
		newAvatar = generateRandomAvatar();
	};
</script>

<div class="flex w-full">
	<button class="group relative" on:click={generateAvatar}>
		<Avatar width={32} height={32} src={newAvatar ?? $UserStore?.avatar} />
		<span class="absolute left-0 top-0 h-full w-full rounded-full group-hover:bg-default/50 group-active:bg-dark/75" />
	</button>
	<div class="ml-1.5 flex w-full flex-col gap-1 child:pr-1 child:pl-0.5">
		<span
			class="w-full break-all text-[14px] font-semibold leading-[18px] text-default outline-none"
			contenteditable="true"
			use:singleLine
			bind:textContent={newName}
			use:maxLength={{ maxLength: UserConstr.name.maxLength }}
		>
			{$UserStore?.name}
		</span>
		<span class="text-[12px] leading-[16px] text-muted">{$UserStore?.id}</span>
	</div>
</div>
