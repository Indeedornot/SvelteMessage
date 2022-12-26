<script lang="ts">
	import { UserStore } from '$lib/stores';
	import { writable } from 'svelte/store';

	import ChannelContent from './Channels/ChannelContent.svelte';
	import Channels from './Channels/ChannelIcons.svelte';
	import Header from './Header/Header.svelte';

	export let canSend: boolean;
	let showUsers = true;
	export const editingServer = writable(false);
</script>

<div class="relative flex h-full w-full flex-none flex-col border-2 border-subtle" id="chat">
	{#if !$editingServer}
		<div class="box-border flex h-[52px] w-full flex-none border-b-2 border-muted bg-dark">
			<Header bind:showUsers={showUsers} />
		</div>
		<div class="flex min-h-0 w-full flex-grow flex-row">
			<Channels />
			<div class="flex h-full min-w-0 flex-grow bg-default">
				{#if $UserStore?.currChannel?.id}
					<ChannelContent canSend={canSend} showUsers={showUsers} />
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.messages {
		overflow-y: auto;
		overscroll-behavior: contain;
		scroll-snap-type: y mandatory;
	}

	.messages > :global(*) {
		scroll-snap-align: start;
		padding-bottom: 12px;
		padding-left: 10px;
		padding-right: 8px;
	}

	.messages > :global(:first-child) {
		padding-top: 12px;
	}
</style>
