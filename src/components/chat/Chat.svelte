<script lang="ts">
	import { sendNewMessage } from '$lib/helpers/backend';
	import type { MessageCreateApiData } from '$lib/models/Message/MessageData';
	import { MessageCache, UserStore } from '$lib/stores';

	import Channels from './Channels/Channels.svelte';
	import Header from './Header/Header.svelte';
	import Message from './Message/Message.svelte';
	import OnlineUsers from './OnlineUsers.svelte';
	import SendBar from './SendBar/SendBar.svelte';

	export let canSend: boolean;
	let showUsers = true;

	const sendMessage = (text: string) => {
		if (!canSend || !$UserStore) return;
		const data: MessageCreateApiData = { text: text };
		sendNewMessage(data);
	};
</script>

<div class="relative flex h-full w-full flex-none flex-col border-2 border-subtle" id="chat">
	<div class="box-border flex h-[52px] w-full flex-none border-b-2 border-muted bg-dark">
		<Header bind:showUsers={showUsers} />
	</div>
	<div class="flex min-h-0 w-full flex-grow flex-row">
		<Channels />
		<div class="flex h-full min-w-0 flex-grow bg-default">
			{#if $UserStore?.lastChannelId !== null}
				<div class="flex min-w-0 flex-grow flex-col bg-default">
					<div class="messages flex min-h-0 w-full flex-grow flex-col">
						{#each $MessageCache as message (message.id)}
							<Message data={message} />
						{/each}
					</div>
					<div class="px-2.5 pb-4">
						<SendBar onSumbit={sendMessage} canSend={canSend} />
					</div>
				</div>
				{#if showUsers}
					<OnlineUsers />
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.messages {
		overflow-y: auto;
		overscroll-behavior: contain;
		scroll-snap-type: y mandatory;
	}

	.messages > :global(*) {
		scroll-snap-align: start;
		padding-bottom: 12px;
		padding-left: 10px;
		padding-right: 8px;
	}

	.messages > :global(:first-child) {
		padding-top: 12px;
	}

	.users > :global(*) {
		padding-bottom: 4px;
	}

	.users > :global(:first-child) {
		padding-top: 8px;
	}
</style>
