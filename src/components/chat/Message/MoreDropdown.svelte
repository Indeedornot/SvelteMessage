<script lang="ts">
	import { Edit } from '$components/icons';
	import { UserStore } from '$lib/stores';

	export let onEdit: () => void;
	export let senderId: number;
</script>

<div class="absolute right-1 top-1 hidden group-hover:block">
	{#if $UserStore?.id === senderId}
		<!-- Add edit button -->
		<button class="rounded-md p-1 text-icon outline-none hover:bg-subtle hover:text-emphasis" on:click={onEdit}>
			<Edit size={20} />
		</button>
	{/if}
</div>
