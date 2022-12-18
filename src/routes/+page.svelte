<script lang="ts">
	import { browser } from '$app/environment';
	import Chat from '$components/chat/Chat.svelte';
	import { io } from '$lib/backend/socketio/socket-client';
	import { addMessageListener } from '$lib/helpers/socketio/Messages';
	import { addUserListener, goOnline } from '$lib/helpers/socketio/User';
	import { MessageCache, OnlineUsers, UserStore } from '$lib/stores';
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
</script>

<div class="flex h-full w-full flex-none items-center justify-center">
	<div class="h-[775px] w-[650px]">
		<Chat canSend={canSend} />
	</div>
</div>
