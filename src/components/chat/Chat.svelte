<script lang="ts">
	import type { MessageData } from '$lib/models/MessageData';
	import type { UserData } from '$lib/models/UserData';

	import Header from './Header/Header.svelte';
	import Message from './Message.svelte';
	import SendBar from './SendBar/SendBar.svelte';

	export let messages: MessageData[] = [];

	export let onlineUsers: UserData[] = [];
	export let user: UserData;

	export let sendMessage: (text: string) => void;
</script>

<div class="flex h-full w-full flex-none flex-col border-2 border-subtle">
	<div class="box-border h-[52px] border-b-2 border-emphasis bg-dark px-3.5">
		<Header user={user} />
	</div>
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
</style>
