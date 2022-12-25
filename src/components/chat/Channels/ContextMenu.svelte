<script lang="ts">
	import { clickOutside } from '$lib/helpers/clickOutside';
	import { portal } from 'svelte-portal';

	import ContextOption from './ContextOption.svelte';

	export let position: { x: number; y: number };
	export let onClose: () => void;
</script>

<div
	class="shadow-md absolute w-[188px] rounded-md bg-overlay py-2 px-1.5"
	style={`top: ${position.y}px; left: ${position.x}px;`}
	use:clickOutside={{
		exceptions: [],
		callback: onClose
	}}
	use:portal={document.body}
	hidden
>
	<div class="flex flex-col items-center justify-center rounded-md bg-dark text-muted">
		<ContextOption text="Leave" handleClick={() => {}} isDisabled={true} />
		<ContextOption text="Delete" handleClick={() => {}} />
		<ContextOption>Edit</ContextOption>
	</div>
</div>
