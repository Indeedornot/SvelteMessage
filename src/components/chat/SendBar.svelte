<script lang="ts">
	import AddMore from './AddMore.svelte';
	import SendButton from './SendButton.svelte';

	export let inputBar: HTMLInputElement;
</script>

<div class="flex h-[44px] w-full flex-none flex-row items-center rounded-md bg-subtle py-3 px-1.5">
	<div class="px-2">
		<AddMore />
	</div>
	<div class="flex h-[22px] flex-grow px-2">
		<input
			bind:this={inputBar}
			type="text"
			class="mt-0 box-border h-full w-full border-0 border-b-2 bg-transparent px-0.5 text-default caret-default focus:ring-0"
		/>
	</div>
	<div class="mt-0.5 px-2">
		<SendButton onSend={() => {}} />
	</div>
</div>
