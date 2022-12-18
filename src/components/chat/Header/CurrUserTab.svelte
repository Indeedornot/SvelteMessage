<script lang="ts">
	import DropdownBase from '$components/helpers/Dropdown/DropdownBase.svelte';
	import { Refresh } from '$components/icons';
	import { generateRandomAvatar } from '$lib/helpers/RandomAvatar';
	import { maxLength, singleLine } from '$lib/helpers/contentEditable';
	import { UserConstr, type UserUpdateData } from '$lib/models';
	import { UserStore } from '$lib/stores';

	import Avatar from '../Avatar.svelte';

	export let canShow = true;
	export let showTooltip = true;

	let newName: string;
	$: $UserStore?.name, resetName();

	let newAvatar: string;
	$: $UserStore?.avatar, resetAvatar();

	const resetName = () => {
		newName = $UserStore?.name ?? '';
	};

	const resetAvatar = () => {
		newAvatar = $UserStore?.avatar ?? '';
	};

	let updatingData = false;
	const updateUsername = async () => {
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

	const generateAvatar = () => {
		newAvatar = generateRandomAvatar();
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
			<Avatar width={32} height={32} src={$UserStore?.avatar} />
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
			<div class="flex flex-row items-center">
				<button class="group relative" on:click={generateAvatar}>
					<Avatar width={32} height={32} src={newAvatar ?? $UserStore?.avatar} />
					<span class="absolute left-0 top-0 h-full w-full group-hover:bg-default/50 group-active:bg-dark/75" />
				</button>
				<div class="ml-1.5 flex w-full flex-col gap-1 child:pr-1 child:pl-0.5">
					<span
						class="w-full break-all text-[14px] font-semibold leading-[18px] text-default outline-none"
						contenteditable="true"
						use:singleLine
						bind:textContent={newName}
						use:maxLength={{ maxLength: UserConstr.name.maxLength }}
					>
						{$UserStore?.name}
					</span>
					<span class="text-[12px] leading-[16px] text-muted">{$UserStore?.id}</span>
				</div>
			</div>
			<div class="w-full pt-1.5">
				<div class="flex flex-grow gap-1">
					<button class="rounded-sm bg-default p-1 text-muted" on:click={resetName}><Refresh size={12} /></button>
					<button
						class="flex flex-grow justify-center rounded-sm bg-accent px-2 text-[12px] text-accent"
						on:click={updateUsername}
					>
						Sumbit
					</button>
				</div>
			</div>
		</div>
	</div>
</DropdownBase>
