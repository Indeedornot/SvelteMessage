<script lang="ts">
	import { slide } from '$lib/helpers/slideAnim';
	import { OnlineUsersStore, UserStore } from '$lib/stores';

	import UserTab from './SideBar/UserTab.svelte';
</script>

<div
	class="users flex h-full w-[200px] flex-none flex-col overflow-y-scroll bg-dark"
	in:slide={{ duration: 150, axis: 'z' }}
	out:slide={{ duration: 150, axis: 'z' }}
>
	<UserTab user={$UserStore} online={true} />
	{#each $OnlineUsersStore.online as onlineUser (onlineUser.id)}
		<UserTab user={onlineUser} online={true} />
	{/each}

	{#each $OnlineUsersStore.offline as offlineUser (offlineUser.id)}
		<UserTab user={offlineUser} online={false} />
	{/each}
</div>

<style>
	.users > :global(*) {
		padding-bottom: 4px;
	}

	.users > :global(:first-child) {
		padding-top: 8px;
	}
</style>
