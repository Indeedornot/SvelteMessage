<script lang="ts">
	import { changeMessage, deleteMessage } from '$lib/backend';
	import type { MessageData } from '$lib/models';
	import { MessageCache } from '$lib/stores';

	import MessageContent from './MessageContent.svelte';
	import MoreDropdown from './MoreDropdown.svelte';

	export let data: MessageData;

	let isEdited = false;
	let isUpdating = false;

	const onEdit = () => {
		if (isUpdating) return;
		isEdited = !isEdited;
	};

	const onEdited = async (text: string) => {
		console.log(isUpdating, text);

		if (isUpdating) return;
		isUpdating = true;
		await changeMessage(data.id, { text: text });
		console.log('updated');
		isUpdating = false;
	};

	const onRemove = async () => {
		deleteMessage(data.id);
	};
</script>

<div class="group relative">
	<MessageContent data={data} bind:isEdited={isEdited} isUpdating={isUpdating} onEdited={onEdited} />
	<MoreDropdown onEdit={onEdit} senderId={data.sender.id} onRemove={onRemove} />
</div>
