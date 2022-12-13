<script lang="ts">
	import type { MessageData } from '$lib/models/MessageData';
	import Time from 'svelte-time';

	import Avatar from './Avatar.svelte';

	export let data: MessageData;

	export let online: boolean;
</script>

<div class="flex flex-none flex-row border-b-muted">
	<div class="pr-2">
		<div class="h-[40px] w-[40px] overflow-hidden rounded-full bg-subtle">
			<!-- svelte-ignore a11y-missing-attribute -->
			<Avatar width={40} height={40} src={data.sender.avatar} />
		</div>
	</div>
	<div class="mt-0.5 flex flex-grow flex-col">
		<div class="flex w-full flex-none justify-between">
			<span class="text-muted">{data.sender.name} {online ? 'Online' : ''}</span>
			<Time class="text-muted" timestamp={data.timestamp} relative live />
		</div>
		<span class="h-full w-full break-words text-default">{data.text}</span>
	</div>
</div>
