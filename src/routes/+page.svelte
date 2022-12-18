<script lang="ts">
	import { browser } from '$app/environment';
	import Chat from '$components/chat/Chat.svelte';
	import { io } from '$lib/backend/socketio/socket-client';
	import { addMessageListener, getMessages } from '$lib/helpers/socketio/Messages';
	import { addUserListener, getOnlineUsers, getUser, goOnline } from '$lib/helpers/socketio/User';
	import type { MessageData, UserData } from '$lib/models';
	import { MessageCache, OnlineUsers, UserStore, UsersCache } from '$lib/stores/MessageCache';
	import { onDestroy, onMount } from 'svelte';

	let canSend = false;

	onMount(() => {
		if (!browser) return;
		setup();
	});

	const setup = async () => {
		await OnlineUsers.fetchUsers();

		await UserStore.fetchUser().then(async (u) => {
			await goOnline(u);
		});

		await MessageCache.fetchMessages();

		//add listeners
		addUserListener();

		addMessageListener();
		canSend = true;
	};

	onDestroy(() => {
		io.emit('UserOffline');
	});

	//update user in onlineUsers

	$: {
		const userIndex = onlineUsers.findIndex((u) => u.id === user.id);
		if (userIndex !== -1) onlineUsers[userIndex] = user;

		messages.map((m) => {
			if (m.sender.id === user.id) m.sender = user;
		});
	}
</script>

<div class="flex h-full w-full flex-none items-center justify-center">
	<div class="h-[775px] w-[650px]">
		<Chat bind:messages={$MessageCache} bind:onlineUsers={$OnlineUsers} bind:user={$UserStore} canSend={canSend} />
	</div>
</div>

//! ADD usage of $UserStore in messages;
 