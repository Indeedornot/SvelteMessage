<script lang="ts">
	import type { UserData } from '$lib/models';

	import Avatar from '../Avatar.svelte';

	export let user: UserData;
</script>

<div class="px-1.5">
	<div class="flex h-[46px] w-full flex-none flex-row items-center rounded-md pl-1 hover:bg-subtle">
		<Avatar src={user?.avatar} width={32} height={32} />
		<div class="flex flex-col justify-center py-1 pl-2 text-default">
			<span class="text-[16px]">{user?.name}</span>
			<span class="text-[12px] text-muted">{user?.id}</span>
		</div>
	</div>
</div>
