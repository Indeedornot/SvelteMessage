<script lang="ts">
	import DropdownBase from '$components/helpers/Dropdown/DropdownBase.svelte';
	import { Refresh } from '$components/icons';
	import { generateRandomAvatar } from '$lib/helpers/RandomAvatar';
	import { singleLine } from '$lib/helpers/contentEditable';
	import { maxLength } from '$lib/helpers/contentEditable/maxLength';
	import { updateUser } from '$lib/helpers/socketio/User';
	import { UserConstr, type UserData } from '$lib/models';

	import Avatar from '../Avatar.svelte';

	export let user: UserData;
	export let canShow = true;
	export let showTooltip = true;

	let newName: string;
	$: user?.name, resetName();

	let newAvatar: string;
	$: user?.avatar, resetAvatar();

	const resetName = () => {
		newName = user?.name;
	};

	const resetAvatar = () => {
		newAvatar = user?.avatar;
	};

	let updatingData = false;
	const updateUsername = () => {
		if (updatingData) return;
		if ((newAvatar === user.avatar && newName === user.name) || (!newName && !newAvatar)) return;

		updatingData = true;

		if (newName) user.name = newName;
		if (newAvatar) user.avatar = newAvatar;

		console.log('updating name');

		updateUser({ name: newName, avatar: newAvatar }).then(() => {
			updatingData = false;
		});
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
		class="flex flex-none items-center rounded-md py-0.5 px-1.5 hover:bg-subtle"
		on:click={() => (showTooltip = !showTooltip)}
	>
		<Avatar width={32} height={32} src={user?.avatar} />
		<div class="ml-1.5 flex flex-col items-start">
			<span class="text-[14px] font-semibold leading-[18px] text-default">{user?.name}</span>
			<span class="text-[12px] leading-[16px] text-muted">{user?.id}</span>
		</div>
	</button>
	<div slot="dropdown" class="flex flex-none items-center rounded-md border-2 border-subtle bg-overlay">
		<div class="m-2 rounded-md bg-dark p-2">
			<div class="flex flex-row items-center">
				<button class="group relative" on:click={generateAvatar}>
					<Avatar width={32} height={32} src={newAvatar ?? user?.avatar} />
					<span class="absolute left-0 top-0 h-full w-full group-hover:bg-default/50 group-active:bg-dark/75" />
				</button>
				<div class="ml-1.5 flex flex-col gap-1 child:pr-1 child:pl-0.5">
					<span
						class="text-[14px] font-semibold leading-[18px] text-default"
						contenteditable="true"
						use:singleLine
						bind:textContent={newName}
						use:maxLength={{ maxLength: UserConstr.name.maxLength }}
					>
						{user?.name}
					</span>
					<span class="text-[12px] leading-[16px] text-muted">{user?.id}</span>
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
