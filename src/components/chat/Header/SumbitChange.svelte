<script lang="ts">
	import { Refresh } from '$components/icons';

	export let resetDisplay: () => void;
	export let updateDisplay: () => void;
</script>

<div class="flex flex-grow gap-1">
	<button class="rounded-sm bg-default p-1 text-muted" on:click={resetDisplay}><Refresh size={12} /></button>
	<button
		class="flex flex-grow justify-center rounded-sm bg-accent px-2 text-[12px] text-accent"
		on:click={updateDisplay}
	>
		Sumbit
	</button>
</div>
