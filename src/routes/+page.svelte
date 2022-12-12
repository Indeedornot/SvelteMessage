<script lang="ts">
	import Chat from '$components/chat/Chat.svelte';
	import { sampleMessages } from '$lib/models/MessageData';
</script>

<div class="flex h-full w-full flex-none items-center justify-center">
	<div class="h-5/6 w-4/12">
		<Chat messages={sampleMessages} />
	</div>
</div>
