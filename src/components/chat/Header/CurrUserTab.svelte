<script lang="ts">
	import DropdownBase from '$components/helpers/Dropdown/DropdownBase.svelte';
	import { updateUser } from '$lib/helpers/backend';
	import { getDifferentInObject, isEmptyObject } from '$lib/helpers/jsUtils';
	import type { UserChangedData, UserData } from '$lib/models';
	import { UserStore } from '$lib/stores';

	import Avatar from '../Avatar.svelte';
	import DisplayChange from './DisplayChange.svelte';
	import StatusChange from './StatusChange.svelte';
	import SumbitChange from './SumbitChange.svelte';

	export let canShow = true;
	export let showTooltip = true;

	const getNewDisplayData = () => {
		return {
			name: user?.name ?? '',
			avatar: user?.avatar ?? ''
		};
	};
	const resetDisplay = () => (updateData = getNewDisplayData());

	let updateData = getNewDisplayData();

	$: user = $UserStore;
	$: user, resetDisplay();

	let isUpdating = false;
	const updateDisplay = async () => {
		if (isUpdating || !user) return;
		const sendData: UserChangedData = getDifferentInObject(user, updateData);
		if (isEmptyObject(sendData)) {
			return;
		}

		isUpdating = true;
		await updateUser(sendData);
		isUpdating = false;
	};
</script>

<DropdownBase
	canShow={canShow}
	bind:showTooltip={showTooltip}
	options={{
		fallbackPlacements: [],
		placement: 'bottom-start',
		offset: { x: 4, y: 0 },
		strategy: 'absolute'
	}}
	zIndex={1}
>
	<button
		slot="button"
		class="flex w-[144px] flex-none flex-row items-center rounded-md py-0.5 px-1.5 hover:bg-subtle"
		on:click={() => (showTooltip = !showTooltip)}
	>
		<div class="flex w-[32px] flex-none">
			<Avatar width={32} height={32} src={user?.avatar} status={user?.status} />
		</div>
		<div class="ml-1.5 flex min-w-0 flex-grow flex-col items-start">
			<span class="w-full truncate text-left text-[14px] font-semibold leading-[18px] text-default">{user?.name}</span>
			<span class="text-[12px] leading-[16px] text-muted">{user?.id}</span>
		</div>
	</button>
	<div slot="dropdown" class="flex flex-none items-center rounded-md border-2 border-subtle bg-overlay">
		<div class="m-2 w-[166px] rounded-md bg-dark p-2">
			<div class="flex flex-col items-center">
				<DisplayChange bind:newAvatar={updateData.avatar} bind:newName={updateData.name} isUpdating={isUpdating} />
				<StatusChange />
			</div>
			<div class="w-full pt-1.5">
				<SumbitChange isUpdating={isUpdating} resetDisplay={resetDisplay} updateDisplay={updateDisplay} />
			</div>
		</div>
	</div>
</DropdownBase>
