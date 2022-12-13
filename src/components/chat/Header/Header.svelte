<script lang="ts">
	import { Users } from '$components/icons';
	import type { UserData } from '$lib/models/UserData';

	import Avatar from '../Avatar.svelte';

	export let user: UserData;
	export let showUsers: boolean;
</script>

<div class="flex h-full w-full flex-none items-center justify-between px-2.5">
	<div class="flex flex-none items-center rounded-md py-0.5 px-1.5 hover:bg-subtle">
		<Avatar width={32} height={32} src={user?.avatar} />
		<div class="ml-1.5 flex flex-col">
			<span class="text-[14px] font-semibold leading-[18px] text-default">{user?.name}</span>
			<span class="text-[12px] leading-[16px] text-muted">{user?.id}</span>
		</div>
	</div>
	<button
		class="rounded-md p-1 text-icon hover:bg-subtle hover:text-emphasis"
		on:click={() => (showUsers = !showUsers)}
	>
		<Users />
	</button>
</div>

<style>
	.messages > :global(*) {
		padding-bottom: 12px;
	}

	.messages > :global(:first-child) {
		padding-top: 12px;
	}

	.messages > :global(*) {
		padding-left: 10px;
		padding-right: 10px;
	}
</style>
