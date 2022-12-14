<script lang="ts">
	import { clickOutside } from '$lib/helpers/clickOutside';

	import { type DropdownProps, createDropdown } from './dropdownCtor';

	export let options: DropdownProps;
	export let canShow: boolean = true;
	export let showTooltip: boolean;
	export let zIndex: number = 0;
	$: if (!canShow && showTooltip) {
		showTooltip = false;
	}

	let buttonRef: HTMLElement;
	const { popperRef, popperContent, extraOpts } = createDropdown(options);
</script>

<div bind:this={buttonRef} use:popperRef>
	<slot name="button" />
</div>
{#if showTooltip}
	<div
		use:popperContent={extraOpts}
		use:clickOutside={[buttonRef]}
		on:clickOutside={() => (showTooltip = false)}
		style:z-index={zIndex}
	>
		<slot name="dropdown" />
	</div>
{/if}
