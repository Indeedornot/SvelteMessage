<script lang="ts">
	import { autoResize } from '$lib/helpers/textArea/autoResize';
	import { MessageConstr } from '$lib/models';

	import AddMore from './AddMore.svelte';
	import SendButton from './SendButton.svelte';

	export let onSumbit: (text: string) => void;
	export let canSend: boolean;

	let inputBar: HTMLTextAreaElement;

	export const sendMessage = () => {
		console.log('sending message');

		if (inputBar.value.length < MessageConstr.text.minLength || inputBar.value.length > MessageConstr.text.maxLength) {
			return;
		}
		console.log('sending message', inputBar.value);

		onSumbit(inputBar.value);
		inputBar.value = '';
	};
</script>

<div class="w-full items-start rounded-md bg-subtle py-2.5 px-1.5">
	<div class="flex w-full flex-none flex-row">
		<div class="px-2">
			<AddMore />
		</div>

		<div class="flex flex-grow px-2">
			<textarea
				bind:this={inputBar}
				on:keydown|capture={(e) => {
					if (e.key !== 'Enter' || e.shiftKey) return;
					e.preventDefault();
					sendMessage();
				}}
				disabled={!canSend}
				class="box-border
				max-h-[100px] w-full resize-none
				border-0 bg-transparent py-0
				px-0.5 text-default caret-default outline-none focus:ring-0"
				maxLength={MessageConstr.text.maxLength}
				use:autoResize={inputBar?.value}
				rows={1}
			/>
			<!-- use:maxRows={{ maxRows: 5, minRows: 1, start: 1 }} -->
		</div>

		<div class="mt-0.5 px-2">
			<SendButton onSend={sendMessage} />
		</div>
	</div>
</div>
