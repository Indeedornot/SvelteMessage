<script lang="ts">
	import { slide } from '$lib/helpers/slideAnim';
	import { sendNewMessage } from '$lib/helpers/socketio/Messages';
	import type { MessageData, MessageNewData } from '$lib/models/MessageData';
	import type { UserData } from '$lib/models/UserData';

	import Header from './Header/Header.svelte';
	import Message from './Message.svelte';
	import SendBar from './SendBar/SendBar.svelte';
	import UserTab from './SideBar/UserTab.svelte';

	export let messages: MessageData[] = [];

	export let onlineUsers: UserData[] = [];
	export let user: UserData;

	export let canSend: boolean;
	let showUsers = true;

	const sendMessage = (text: string) => {
		if (!canSend) return;
		const data: MessageNewData = { text: text, sender: user, timestamp: new Date() };
		sendNewMessage(data);
	};

	$: console.log(user);
</script>

<div class="flex h-full w-full flex-none flex-col border-2 border-subtle">
	<div class="box-border h-[52px] border-b-2 border-muted bg-dark">
		<Header bind:showUsers={showUsers} bind:user={user} />
	</div>
	<div class="flex min-h-0 flex-grow">
		<div class="box-border flex min-h-0 flex-grow flex-col bg-default">
			<div class="messages flex w-full flex-grow flex-col overflow-y-auto">
				{#each messages as message (message.id)}
					<Message data={message} online={!!onlineUsers.find((x) => x.id === message.sender.id)} />
				{/each}
			</div>
			<div class="mb-2 px-2.5 pb-2">
				<SendBar onSumbit={sendMessage} />
			</div>
		</div>
		{#if showUsers}
			<div
				class="users right-0 h-full w-4/12 bg-dark"
				in:slide={{ duration: 150, axis: 'z' }}
				out:slide={{ duration: 150, axis: 'z' }}
			>
				{#each onlineUsers as onlineUser (onlineUser.id)}
					<UserTab user={onlineUser} />
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
		padding-right: 10px;
	}

	.users > :global(*) {
		padding-bottom: 4px;
	}

	.users > :global(:first-child) {
		padding-top: 8px;
	}
</style>
