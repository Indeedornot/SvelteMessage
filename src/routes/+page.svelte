<script lang="ts">
	import { browser } from '$app/environment';
	import Chat from '$components/chat/Chat.svelte';
	import { io } from '$lib/backend/socketio/socket-client';
	import {
		addChannelListener,
		addMessageListener,
		addUserListener,
		fetchChannelData,
		goOnline
	} from '$lib/helpers/backend';
	import { UserStore } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';

	let canSend = false;

	onMount(() => {
		if (!browser) return;
		setup();
	});

	const setup = async () => {
		await UserStore.fetch().then(async (u) => {
			await goOnline(u);
			if (u?.currData?.channel?.id) {
				await fetchChannelData(u.currData.channel.id);
			}
			canSend = true;
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
