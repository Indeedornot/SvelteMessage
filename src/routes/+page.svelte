<script lang="ts">
	import { browser } from '$app/environment';
	import Chat from '$components/chat/Chat.svelte';
	import { addMessageListener, getMessages } from '$lib/helpers/socketio/Messages';
	import { addUserListener, getName, getOnlineUsers, goOnline } from '$lib/helpers/socketio/User';
	import type { MessageData, UserData } from '$lib/models';
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
			onlineUsers = [...onlineUsers, user];
		});

		messages = await getMessages();

		//add listeners
		addUserListener(
			(data) => {
				if (!onlineUsers.find((u) => u.id === data.id)) onlineUsers = [...onlineUsers, data];
			},
			(userId) => {
				onlineUsers = onlineUsers.filter((u) => u.id !== userId);
			},
			(userId, name) => {
				const user = onlineUsers.find((u) => u.id === userId);
				if (!user) return;

				user.name = name;
				onlineUsers = onlineUsers;
			}
		);

		addMessageListener((message) => {
			messages = [...messages, message];
		});

		canSend = true;
	};

	onDestroy(() => {
		io.emit('UserOffline');
	});
</script>

<div class="flex h-full w-full flex-none items-center justify-center">
	<div class="h-[775px] w-[650px]">
		<Chat bind:messages={messages} bind:onlineUsers={onlineUsers} bind:user={user} canSend={canSend} />
	</div>
</div>
