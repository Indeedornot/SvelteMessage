<script lang="ts">
	import type { UserData } from '$lib/models/UserData';

	import Avatar from '../Avatar.svelte';

	export let user: UserData;
</script>

<div class="flex h-full w-full flex-none items-center">
	<Avatar width={32} height={32} src={user?.avatar} />
	<div class="ml-1 flex flex-col">
		<span class="text-[14px] font-semibold leading-[18px] text-default">{user?.name}</span>
		<span class="text-[12px] leading-[16px] text-muted">{user?.id}</span>
	</div>
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
