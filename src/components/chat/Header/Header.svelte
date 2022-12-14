<script lang="ts">
	import { Users } from '$components/icons';
	import type { UserData } from '$lib/models/UserData';

	import CurrUserTab from './CurrUserTab.svelte';

	export let user: UserData;
	export let showUsers: boolean;
</script>

<div class="flex h-full w-full flex-none items-center justify-between px-2.5">
	<CurrUserTab bind:user={user} />
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
