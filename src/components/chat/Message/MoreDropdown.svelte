<script lang="ts">
	import { Edit, Trash } from '$components/icons';
	import type { UserData } from '$lib/models';
	import { UserStore } from '$lib/stores';

	export let onEdit: () => void;
	export let onRemove: () => void;
	export let senderId: number;

	$: user = $UserStore;
</script>

<div class="absolute right-1 top-1 hidden group-hover:block">
	{#if user}
		{#if user.id === senderId}
			<!-- Add edit button -->
			<button class="rounded-md p-1 text-icon outline-none hover:bg-subtle hover:text-emphasis" on:click={onEdit}>
				<Edit size={20} />
			</button>
		{/if}
		{#if user.id === senderId}
			<!--  || user.currChannel?.owner -->
			<button class="rounded-md p-1 text-icon outline-none hover:bg-subtle hover:text-emphasis" on:click={onRemove}>
				<Trash size={20} />
			</button>
		{/if}
	{/if}
</div>
