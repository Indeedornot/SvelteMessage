<script lang="ts">
	import type { MessageData } from '$lib/models/MessageData';
	import Time from 'svelte-time';

	import Avatar from './Avatar.svelte';

	export let data: MessageData;

	export let online: boolean;
</script>

<div class="flex w-full flex-none flex-row border-b-muted">
	<div class="mr-2 flex h-full w-[40px] flex-none">
		<!-- svelte-ignore a11y-missing-attribute -->
		<Avatar width={40} height={40} src={data.sender.avatar} />
	</div>
	<div class="flex min-w-0 flex-grow overflow-hidden pt-0.5">
		<div class="flex w-full flex-none flex-col overflow-hidden">
			<div class="flex w-full flex-none justify-between">
				<span class="text-muted">{data.sender.name} {online ? 'Online' : ''}</span>
				<Time class="text-muted" timestamp={data.timestamp} relative live />
			</div>
			<p class="flex w-full min-w-0 flex-none break-all p-0 text-default">{data.text}</p>
		</div>
	</div>
</div>
