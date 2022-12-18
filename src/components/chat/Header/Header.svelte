<script lang="ts">
	import { Refresh, Users } from '$components/icons';
	import { getUser } from '$lib/helpers/socketio/User';
	import type { UserData } from '$lib/models/UserData';

	import CurrUserTab from './CurrUserTab.svelte';

	export let user: UserData;
	export let showUsers: boolean;

	let fetchingUser = false;
	const refetchUser = async () => {
		if (fetchingUser) return;
		fetchingUser = true;
		user = await getUser();
		console.log('fetched user', user);

		fetchingUser = false;
	};
</script>

<div class="flex h-full w-full flex-none items-center justify-between px-2.5">
	<div class="flex flex-none flex-row items-center">
		<CurrUserTab bind:user={user} />
		<button class="ml-1 rounded-md p-1 text-muted hover:bg-subtle" on:click={refetchUser}>
			<Refresh size={20} />
		</button>
	</div>
	<button
		class="rounded-md p-1 text-icon hover:bg-subtle hover:text-emphasis"
		on:click={() => (showUsers = !showUsers)}
	>
		<Users />
	</button>
</div>
