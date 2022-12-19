<script lang="ts">
	import { clickOutside } from '$lib/helpers/clickOutside';

	import { type DropdownProps, createDropdown } from './dropdownCtor';
	import { dropdownHover } from './dropdownHover';

	export let options: DropdownProps;
	export let canShow: boolean = true;
	export let showTooltip: boolean;
	export let zIndex: number = 0;
	export let className = '';
	export let hover = false;
	$: if (!canShow && showTooltip) {
		showTooltip = false;
	}

	let buttonRef: HTMLElement;
	const { popperRef, popperContent, extraOpts } = createDropdown(options);
</script>

{#if !hover}
	<div bind:this={buttonRef} class={className} use:popperRef>
		<slot name="button" />
	</div>
{:else}
	<div
		bind:this={buttonRef}
		class={className}
		use:popperRef
		use:dropdownHover={(hover) => {
			showTooltip = hover;
		}}
	>
		<slot name="button" />
	</div>
{/if}

{#if showTooltip}
	<div
		use:popperContent={extraOpts}
		use:clickOutside={{ exceptions: [buttonRef], callback: () => (showTooltip = false) }}
		style:z-index={zIndex}
	>
		<slot name="dropdown" />
	</div>
{/if}
