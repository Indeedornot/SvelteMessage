<script lang="ts">
	export let isDisabled: boolean = false;

	export let text: string | undefined = undefined;
	export let handleClick: () => void = () => {};
</script>

{#if text}
	<button
		class="w-full py-1.5 px-2 text-left text-[14px] first:rounded-t-md last:rounded-b-md 
		hover:bg-blue-700 hover:text-emphasis 
		disabled:bg-transparent disabled:text-disabled"
		on:click={handleClick}
		disabled={isDisabled}
	>
		{text}
	</button>
{:else}
	<div
		class="w-full py-1.5 px-2 text-left text-[14px] first:rounded-t-md last:rounded-b-md 
		hover:bg-blue-700 hover:text-emphasis 
		disabled:bg-transparent disabled:text-disabled"
	>
		<slot />
	</div>
{/if}
