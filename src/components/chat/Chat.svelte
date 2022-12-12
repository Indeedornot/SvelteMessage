<script lang="ts">
	import type { MessageData } from '$lib/models/MessageData';

	import Message from './Message.svelte';
	import SendBar from './SendBar.svelte';

	export let messages: MessageData[] = [];
</script>

<div class="flex h-full w-full flex-none flex-col bg-default px-2.5 py-2">
	<div class="messages flex w-full flex-grow flex-col overflow-y-auto">
		{#each messages as message (message.id)}
			<Message data={message} />
		{/each}
	</div>
	<div class="mb-2">
		<SendBar />
	</div>
</div>

<style>
	.messages > :global(:not(:last-child)) {
		padding-bottom: 12px;
	}
</style>
