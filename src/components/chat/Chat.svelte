<script lang="ts">
	import { browser } from '$app/environment';
	import { MessageData, MessageScheme, sampleMessages } from '$lib/models/MessageData';
	import { io } from '$lib/socketio/socket-client';
	import { events } from '$lib/socketio/socket-events';
	import { onMount } from 'svelte';

	import Avatar from './Avatar.svelte';
	import Message from './Message.svelte';
	import SendBar from './SendBar.svelte';

	let messages: MessageData[] = sampleMessages;
	let userId = '';
	let userName = '';

	onMount(() => {
		if (!browser) return;

		if (localStorage.getItem('userId') !== null) {
			userId = localStorage.getItem('userId')!;
			userName = localStorage.getItem('userName') ?? userId;
		} else {
			io.emit(events.NAME);
			io.on(events.NAME, (name: string) => {
				userId = name;
				userName = name;
				localStorage.setItem('userId', userId);
				localStorage.setItem('userName', userName);

				//! To be tested
				io.off(events.NAME);
			});
		}

		io.on(events.MESSAGE, (message: MessageData) => {
			const data = new MessageData({ ...message });
			console.log('received message from server', data);
			messages = [...messages, data];
		});
	});

	const sendMessage = (text: string) => {
		const data = new MessageData({ text: text, senderId: userId, senderName: userName });
		console.log('sending message to server', data);

		io.emit(events.MESSAGE, data);
	};
</script>

<div class="flex h-full w-full flex-none flex-col border-2 border-subtle">
	<div class="box-border h-[52px] border-b-2 border-emphasis bg-dark px-3.5">
		<div class="flex h-full w-full flex-none items-center">
			<Avatar width={32} height={32} username={userName} />
			<div class="ml-1 flex flex-col">
				<span class="text-[14px] font-semibold leading-[18px] text-default">{userName}</span>
				<span class="text-[12px] leading-[16px] text-muted">{userId}</span>
			</div>
		</div>
	</div>
	<!-- Header -->
	<div class="box-border flex min-h-0 flex-grow flex-col bg-default">
		<div class="messages flex w-full flex-grow flex-col overflow-y-auto">
			{#each messages as message (message.id)}
				<Message data={message} />
			{/each}
		</div>
		<div class="mb-2 px-2.5 pb-2">
			<SendBar onSumbit={sendMessage} />
		</div>
	</div>
</div>

<style>
	.messages > :global(:not(:last-child)) {
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
