<script lang="ts">
	import type { MessageData } from '$lib/models/Message/MessageData';
	import Time from 'svelte-time';

	import Avatar from '../Avatar.svelte';

	export let data: MessageData;
	export let isEdited: boolean;
	export let isUpdating: boolean;
	export let onEdited: (text: string) => void;

	let editedText: string = data.text;

	const edited = () => {
		if (editedText.length === 0) return;
		isEdited = false;

		if (editedText === data.text) return;

		console.log(Date.now(), '- Edited to -', editedText);
		onEdited(editedText);
	};

	const cancelEdit = () => {
		isEdited = false;
		editedText = data.text;
	};
</script>

<div class="flex w-full flex-none flex-row border-b-muted">
	<div class="flex h-full w-[40px] flex-none">
		<!-- svelte-ignore a11y-missing-attribute -->
		<Avatar width={40} height={40} src={data.sender.avatar} />
	</div>
	<div class="ml-1 flex min-w-0 flex-grow flex-col pt-0.5">
		<div class="flex w-full flex-none items-center pl-1">
			<span class="text-[16px] text-default">{data.sender.name}</span>
			<Time class="ml-1 text-[12px] text-muted" timestamp={data.createdAt} relative live />
		</div>
		<div class="flex w-full flex-none flex-col break-all text-default">
			{#if !isUpdating}
				{#if !isEdited}
					<div class="p-0 pl-1">
						{data.text}
					</div>
				{:else}
					<div
						class="pr-0,5 rounded-md bg-dark p-0 pl-1 outline-none"
						contenteditable="true"
						on:keydown={(e) => {
							if (e.key === 'Escape') {
								e.preventDefault();
								cancelEdit();
							} else if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								edited();
							}
						}}
						on:input={(e) => {
							editedText = e.currentTarget.innerText;
						}}
					>
						{editedText}
					</div>
					<div class="flex flex-row gap-1 text-[12px]">
						<p>escape to <button class="text-anchor" on:click={cancelEdit}>cancel</button></p>
						•
						<p>enter to save <button class="text-anchor" on:click={edited}>sumbit</button></p>
					</div>
				{/if}
			{:else}
				<div class="bg-dark p-0 pl-1">
					{data.text}
				</div>
			{/if}
		</div>
	</div>
</div>
