<script lang="ts">
	import { autoResize } from '$lib/helpers/textArea/autoResize';
	import { MessageConstr } from '$lib/models';

	import AddMore from './AddMore.svelte';
	import SendButton from './SendButton.svelte';

	export let onSumbit: (text: string) => void;

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
				on:keydown={(e) => {
					if (e.key !== 'Enter' || e.shiftKey) return;
					e.preventDefault();
					sendMessage();
				}}
				on:input={() => {
					const scrollHeight = inputBar.scrollHeight;
					inputBar.style.height = scrollHeight + 'px';
				}}
				class="box-border
				max-h-[100px] w-full resize-none
				border-0 bg-transparent py-0
				px-0.5 text-default caret-default outline-none focus:ring-0"
				maxLength={MessageConstr.text.maxLength}
				use:autoResize
				rows={1}
			/>
			<!-- use:maxRows={{ maxRows: 5, minRows: 1, start: 1 }} -->
		</div>

		<div class="mt-0.5 px-2">
			<SendButton onSend={sendMessage} />
		</div>
	</div>
</div>

<!-- 
	
<div class="flex w-full flex-none flex-row items-start rounded-md bg-subtle py-2.5 px-1.5">
	<div class="h-[50px]"/>
	<div class="flex flex-grow px-2">
		<span
			contenteditable="true"
			bind:this={inputBar}
			on:keydown={(e) => {
				if (e.key !== 'Enter') return;
				sendMessage();
			}}
			use:maxLength={{ maxLength: MessageConstr.text.maxLength }}
			class="box-border w-full break-all border-0 border-b-2 bg-transparent px-0.5 text-default caret-default outline-none"
		/>
	</div>
	<div class="h-[50px]"/>
</div>

 -->
