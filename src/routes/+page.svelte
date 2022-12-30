<script lang="ts">
	import { browser } from '$app/environment';
	import Chat from '$components/chat/Chat.svelte';
	import { io } from '$lib/backend/socketio/socket-client';
	import { addChannelListener, addMessageListener, addUserListener, fetchUser } from '$lib/helpers/backend';
	import { onDestroy, onMount } from 'svelte';

	let canSend = false;

	onMount(() => {
		if (!browser) return;
		setup();
	});

	const setup = async () => {
		await fetchUser(true).then((user) => {
			if (user) canSend = true;
		});

		addUserListener();
		addMessageListener();
		addChannelListener();
	};

	onDestroy(() => {
		io.emit('UserOffline');
	});
</script>

<svelte:body on:contextmenu|preventDefault={() => {}} />

<div class="flex h-full w-full flex-none items-center justify-center">
	<div class="h-[775px] w-[650px]">
		<Chat canSend={canSend} />
	</div>
</div>
