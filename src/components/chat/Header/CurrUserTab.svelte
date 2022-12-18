<script lang="ts">
	import DropdownBase from '$components/helpers/Dropdown/DropdownBase.svelte';
	import type { UserUpdateData } from '$lib/models';
	import { UserStore } from '$lib/stores';

	import Avatar from '../Avatar.svelte';
	import DisplayChange from './DisplayChange.svelte';
	import StatusChange from './StatusChange.svelte';
	import SumbitChange from './SumbitChange.svelte';

	export let canShow = true;
	export let showTooltip = true;

	let newName: string = $UserStore?.name ?? '';
	let newAvatar: string = $UserStore?.avatar ?? '';

	$: $UserStore, resetDisplay();
	const resetDisplay = () => {
		newName = $UserStore?.name ?? '';
		newAvatar = $UserStore?.avatar ?? '';
	};

	let updatingData = false;
	const updateDisplay = async () => {
		if (updatingData) return;
		updatingData = true;

		const data: UserUpdateData = {};

		if (newName !== $UserStore?.name) data.name = newName;
		if (newAvatar !== $UserStore?.avatar) data.avatar = newAvatar;
		if (Object.keys(data).length === 0) {
			updatingData = false;
			return;
		}

		await UserStore.updateUser(data);
		updatingData = false;
	};
</script>

<DropdownBase
	canShow={canShow}
	bind:showTooltip={showTooltip}
	options={{
		fallbackPlacements: [],
		placement: 'bottom-start',
		offset: [0, 4],
		strategy: 'absolute'
	}}
>
	<button
		slot="button"
		class="flex w-[144px] flex-none flex-row items-center rounded-md py-0.5 px-1.5 hover:bg-subtle"
		on:click={() => (showTooltip = !showTooltip)}
	>
		<div class="flex w-[32px] flex-none">
			<Avatar width={32} height={32} src={$UserStore?.avatar} status={$UserStore?.status} />
		</div>
		<div class="ml-1.5 flex min-w-0 flex-grow flex-col items-start">
			<span class="w-full truncate text-left text-[14px] font-semibold leading-[18px] text-default"
				>{$UserStore?.name}</span
			>
			<span class="text-[12px] leading-[16px] text-muted">{$UserStore?.id}</span>
		</div>
	</button>
	<div slot="dropdown" class="flex flex-none items-center rounded-md border-2 border-subtle bg-overlay">
		<div class="m-2 w-[166px] rounded-md bg-dark p-2">
			<div class="flex flex-col items-center">
				<DisplayChange bind:newAvatar={newAvatar} bind:newName={newName} />
				<StatusChange />
			</div>
			<div class="w-full pt-1.5">
				<SumbitChange resetDisplay={resetDisplay} updateDisplay={updateDisplay} />
			</div>
		</div>
	</div>
</DropdownBase>
