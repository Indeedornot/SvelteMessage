<script lang="ts">
	import { slide } from '$lib/helpers/slideAnim';
	import { sendNewMessage } from '$lib/helpers/socketio/Messages';
	import type { MessageCreateApiData } from '$lib/models/MessageData';
	import { MessageCache, OnlineUsersStore, UserStore } from '$lib/stores';

	import Header from './Header/Header.svelte';
	import Message from './Message/Message.svelte';
	import SendBar from './SendBar/SendBar.svelte';
	import UserTab from './SideBar/UserTab.svelte';

	export let canSend: boolean;
	let showUsers = true;

	const sendMessage = (text: string) => {
		if (!canSend || !$UserStore) return;
		const data: MessageCreateApiData = { text: text, senderId: $UserStore.id, timestamp: new Date() };
		sendNewMessage(data);
	};
</script>

<div class="flex h-full w-full flex-none flex-col border-2 border-subtle">
	<div class="box-border flex h-[52px] w-full flex-none border-b-2 border-muted bg-dark">
		<Header bind:showUsers={showUsers} />
	</div>
	<div class="flex min-h-0 w-full flex-grow flex-row">
		<div class="flex min-w-0 flex-grow flex-col bg-default">
			<div class="messages flex min-h-0 w-full flex-grow flex-col overflow-y-auto">
				{#each $MessageCache as message (message.id)}
					<Message data={message} />
				{/each}
			</div>
			<div class="px-2.5 pb-4">
				<SendBar onSumbit={sendMessage} />
			</div>
		</div>
		{#if showUsers}
			<div
				class="users flex h-full w-[200px] flex-none flex-col overflow-y-scroll bg-dark"
				in:slide={{ duration: 150, axis: 'z' }}
				out:slide={{ duration: 150, axis: 'z' }}
			>
				<UserTab user={$UserStore} />
				{#each $OnlineUsersStore.online as onlineUser (onlineUser.id)}
					<UserTab user={onlineUser} />
				{/each}

				{#each $OnlineUsersStore.offline as offlineUser (offlineUser.id)}
					<UserTab user={offlineUser} />
				{/each}
			</div>{/if}
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
		padding-right: 8px;
	}

	.users > :global(*) {
		padding-bottom: 4px;
	}

	.users > :global(:first-child) {
		padding-top: 8px;
	}
</style>
