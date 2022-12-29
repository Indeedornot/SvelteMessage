<script lang="ts">
	import { formatCreateDate } from '$lib/helpers/dateUtils';
	import { type BaseUserData, type ChannelUserData, UserStatus } from '$lib/models';
	import { UserStore } from '$lib/stores';

	import Avatar from '../Avatar.svelte';

	export let user: BaseUserData | null;
	export let channelUser: ChannelUserData | null | undefined;
	export let online: boolean;
</script>

<div class="relative flex flex-none items-center justify-center rounded-md border-2 border-subtle bg-subtle">
	<div class="flex max-h-[891px] w-[250px] flex-none flex-col">
		<div class="ml-2.5 mt-2.5 flex w-full flex-col justify-center">
			<Avatar src={user?.avatar} width={64} height={64} status={online ? user?.status : UserStatus.Invisible} />
		</div>
		<div class="m-2 box-border flex flex-grow flex-col overflow-y-auto rounded-md bg-dark p-2">
			<div class="flex flex-none flex-row items-center ">
				<span class="truncate text-[20px] text-default">{user?.name}</span>
				<span class="text-[20px] text-muted">#{user?.id}</span>
			</div>
			<div class="mb-2 h-[4px] border-b border-subtle" />
			<div class="flex flex-none flex-col gap-2">
				<div class="flex flex-none flex-col">
					<span class="truncate text-[12px] font-bold uppercase text-default">Member since</span>
					<div class="flex w-full flex-none flex-row gap-1 text-[14px] text-muted">
						<div>
							<span>{formatCreateDate(user?.createdAt)}</span>
						</div>
						{#if channelUser}
							•
							<div class="flex flex-none items-center gap-1">
								<img src={$UserStore?.currData?.channel.avatar} class="rounded-full" width={16} height={16} />
								<span>
									{formatCreateDate(channelUser.createdAt)}
								</span>
							</div>
						{/if}
					</div>
				</div>
				{#if channelUser}
					<div class="flex flex-none flex-col">
						<span class="truncate text-[12px] font-bold uppercase text-default">
							{#if channelUser?.roles.length > 0}
								Roles
							{:else}
								No roles
							{/if}
						</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
