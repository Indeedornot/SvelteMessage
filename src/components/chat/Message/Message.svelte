<script lang="ts">
	import type { MessageData } from '$lib/models';
	import { MessageCache } from '$lib/stores';

	import MessageContent from './MessageContent.svelte';
	import MoreDropdown from './MoreDropdown.svelte';

	export let data: MessageData;

	let isEdited: boolean = false;

	const onEdit = () => {
		isEdited = !isEdited;
	};

	const onEdited = (text: string) => {
		MessageCache.updateMessage(data.id, { text: text });
	};
</script>

<div class="group relative">
	<MessageContent data={data} bind:isEdited={isEdited} onEdited={onEdited} />
	<MoreDropdown onEdit={onEdit} senderId={data.sender.id} />
</div>
