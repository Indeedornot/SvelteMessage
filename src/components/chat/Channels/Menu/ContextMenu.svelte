<script lang="ts">
	import { clickOutside } from '$lib/helpers/clickOutside';
	import type { ChannelData } from '$lib/models';
	import { UserStore } from '$lib/stores';
	import { portal } from 'svelte-portal';

	import ContextOption from './ContextOption.svelte';

	export let position: { x: number; y: number };
	export let show: boolean;
	export let channel: ChannelData;

	const fixPosition = () => {
		position.y += 10;
		position.x += 10;
	};

	$: position, fixPosition();

	const closeSelf = () => {
		show = false;
	};

	const leaveChannel = async () => {
		await UserStore.crud.channels.remove(channel.id);
		closeSelf();
	};
</script>

<svelte:window on:resize={closeSelf} />
<div
	class="shadow-md border-box absolute z-[2] w-[188px] rounded-md bg-overlay py-2 px-1.5"
	style={`top: ${position.y}px; left: ${position.x}px;`}
	use:clickOutside={{
		exceptions: [],
		callback: closeSelf
	}}
	use:portal
>
	<div class="flex flex-col items-center justify-center rounded-md bg-dark text-muted">
		<ContextOption text="Leave" handleClick={leaveChannel} />
		<ContextOption text="Delete" handleClick={() => {}} isDisabled={!$UserStore?.owned.includes(channel.id)} />
	</div>
</div>
