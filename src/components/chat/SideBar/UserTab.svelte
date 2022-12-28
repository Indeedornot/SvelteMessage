<script lang="ts">
	import { type BaseUserData, UserStatus } from '$lib/models';

	import Avatar from '../Avatar.svelte';

	export let user: BaseUserData | null;
	export let online: boolean;
</script>

<div class="w-full px-1.5">
	<div class="flex h-[46px] w-full flex-none flex-row items-center rounded-md pl-1 hover:bg-subtle">
		<div class="flex w-[32px] flex-none">
			<Avatar src={user?.avatar} width={32} height={32} status={online ? user?.status : UserStatus.Invisible} />
		</div>
		<div class="flex min-w-0 flex-grow flex-col justify-center py-1 pl-2 pr-2 text-default">
			<span class="truncate text-[16px]">{user?.name}</span>
			<span class="text-[12px] text-muted">{user?.id}</span>
		</div>
	</div>
</div>
