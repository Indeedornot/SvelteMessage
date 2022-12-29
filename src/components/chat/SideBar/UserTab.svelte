<script lang="ts">
	import DropdownBase from '$components/helpers/Dropdown/DropdownBase.svelte';
	import { type BaseUserData, type ChannelUserData, UserStatus } from '$lib/models';

	import Avatar from '../Avatar.svelte';
	import UserDropdown from './UserDropdown.svelte';

	export let user: BaseUserData | null;
	export let channelUser: ChannelUserData | null | undefined;
	export let online: boolean;

	export let showMore = true;
</script>

<div class="w-full px-1.5">
	<DropdownBase
		canShow={!!user}
		options={{
			fallbackPlacements: [],
			placement: 'left-start',
			offset: { x: 10, y: 0 },
			strategy: 'absolute'
		}}
		bind:showTooltip={showMore}
	>
		<button
			slot="button"
			class="flex h-[46px] w-full flex-none flex-row items-center rounded-md pl-1 hover:bg-subtle"
			on:click={() => (showMore = !showMore)}
		>
			<div class="flex w-[32px] flex-none">
				<Avatar src={user?.avatar} width={32} height={32} status={online ? user?.status : UserStatus.Invisible} />
			</div>
			<div class="flex min-w-0 flex-grow flex-col items-start justify-center py-1 pl-2 pr-2">
				<span class="truncate text-[16px] text-default">{user?.name}</span>
				<span class="text-[12px] text-muted">{user?.id}</span>
			</div>
		</button>
		<UserDropdown slot='dropdown' user={user} channelUser={channelUser} online={online} />
	</DropdownBase>
</div>
