<script lang="ts">
	import { sendNewMessage } from '$lib/helpers/backend';
	import type { MessageCreateData } from '$lib/models';
	import { MessageCache, UserStore } from '$lib/stores';
	import { writable } from 'svelte/store';

	import Message from '../Message/Message.svelte';
	import OnlineUsers from '../OnlineUsers.svelte';
	import SendBar from '../SendBar/SendBar.svelte';

	export let canSend: boolean;
	export let showUsers: boolean;

	const sendMessage = (text: string) => {
		if (!canSend || !$UserStore?.channelUser) return;
		const data: MessageCreateData = { text: text };
		sendNewMessage(data);
	};

	export const editingServer = writable(false);
</script>

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
</style>
