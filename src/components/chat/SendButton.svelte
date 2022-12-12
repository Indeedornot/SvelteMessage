<script lang="ts">
	import { Send } from '$components/icons';

	export let onSend: () => void;
</script>

<button class="flex h-full flex-none items-center justify-center text-icon hover:text-emphasis" on:click={onSend}>
	<Send />
</button>
