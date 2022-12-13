<script lang="ts">
	import { browser } from '$app/environment';
	import Chat from '$components/chat/Chat.svelte';
	import {
		addMessageListener,
		addUserListener,
		getMessages,
		getName,
		sendNewMessage
	} from '$lib/helpers/socketio/Messages';
	import { getOnlineUsers, goOnline } from '$lib/helpers/socketio/User';
	import type { MessageData, MessageNewData, UserData } from '$lib/models';
	import { io } from '$lib/socketio/socket-client';
	import { onDestroy, onMount } from 'svelte';

	let messages: MessageData[] = [];
	let user: UserData;

	let onlineUsers: UserData[] = [];
	let canSend = false;

	onMount(() => {
		if (!browser) return;
		setup();
	});

	const setup = async () => {
		onlineUsers = await getOnlineUsers();

		user = await getName();
		await goOnline(user).then(() => {
			onlineUsers.push(user);
		});

		messages = await getMessages();

		//add listeners
		addUserListener(
			(data) => {
				if (!onlineUsers.find((u) => u.id === data.id)) onlineUsers = [...onlineUsers, data];
			},
			(userId) => {
				onlineUsers = onlineUsers.filter((u) => u.id !== userId);
			}
		);

		addMessageListener((message) => {
			messages = [...messages, message];
		});

		canSend = true;
	};

	const sendMessage = (text: string) => {
		if (!canSend) return;
		const data: MessageNewData = { text: text, sender: user, timestamp: new Date() };
		sendNewMessage(data);
	};

	onDestroy(() => {
		io.emit('UserOffline');
	});
</script>

<div class="flex h-full w-full flex-none items-center justify-center">
	<div class="h-[775px] w-[650px]">
		<Chat sendMessage={sendMessage} bind:messages={messages} bind:onlineUsers={onlineUsers} bind:user={user} />
	</div>
</div>
