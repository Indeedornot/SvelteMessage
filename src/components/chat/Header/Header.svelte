<script lang="ts">
	import { Refresh, Users } from '$components/icons';
	import { fetchUser } from '$lib/helpers/backend';

	import CurrUserTab from './CurrUserTab.svelte';

	export let showUsers: boolean;

	let fetchingUser = false;
	const refetchUser = async () => {
		if (fetchingUser) return;
		fetchingUser = true;
		await fetchUser(false);
		fetchingUser = false;
	};
</script>

<div class="flex h-full w-full flex-none items-center justify-between px-2.5">
	<div class="flex flex-none flex-row items-center">
		<CurrUserTab />
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
