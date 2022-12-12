<script lang="ts">
	import type { MessageData } from '$lib/models/MessageData';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	export let data: MessageData;
</script>

<div class="flex flex-none flex-row border-b-muted">
	<div class="pr-2">
		<div class="h-[40px] w-[40px] overflow-hidden rounded-full bg-subtle">
			<!-- svelte-ignore a11y-missing-attribute -->
			<img src="https://icotar.com/avatar/{data.sender}" width={40} height={40} />
		</div>
	</div>
	<div class="mt-0.5 flex flex-grow flex-col">
		<div class="flex w-full flex-none justify-between">
			<span class="text-muted">{data.sender}</span>
			<span class="text-muted">{data.timeAgo()}</span>
		</div>
		<span class="h-full w-full break-words text-default">{data.text}</span>
	</div>
</div>
