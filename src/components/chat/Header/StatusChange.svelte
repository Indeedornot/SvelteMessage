<script lang="ts">
	import DropdownBase from '$components/helpers/Dropdown/DropdownBase.svelte';
	import { updateUser } from '$lib/helpers/backend';
	import { UserStatus, getStatusColor, getStatusName } from '$lib/models';
	import { UserStore } from '$lib/stores';

	let isUpdating = false;
	const updateStatus = async (status: UserStatus) => {
		if (isUpdating || status === $UserStore?.status) return;
		isUpdating = true;
		await updateUser({ status });
		isUpdating = false;
	};

	let showTooltip = false;
</script>

<div class="my-[6px] h-[20px] w-full">
	<DropdownBase
		options={{
			fallbackPlacements: [],
			placement: 'right-start',
			offset: { x: 16, y: -3 },
			strategy: 'absolute'
		}}
		bind:showTooltip={showTooltip}
		className="w-full"
		hover={true}
	>
		<button
			class="group flex h-full w-full flex-none items-center rounded-sm px-1 hover:bg-subtle"
			on:click={() => (showTooltip = !showTooltip)}
			slot="button"
		>
			<div class="h-[12px] w-[12px] rounded-full bg-{getStatusColor($UserStore?.status)} group-hover:bg-white" />
			<span class="ml-1 pb-[1px] text-[14px] text-muted group-hover:text-default"
				>{getStatusName($UserStore?.status)}</span
			>
		</button>
		<div slot="dropdown" class="rounded-md border-2 border-subtle bg-overlay p-1.5">
			<div class="flex flex-none flex-col gap-0.5 rounded-md bg-dark">
				{#each Object.values(UserStatus) as status}
					<button
						class="flex w-full flex-none flex-row items-center rounded-md px-1.5 py-1.5 hover:bg-subtle"
						on:click={() => updateStatus(status)}
					>
						<div class="flex flex-none">
							<div class="h-[12px] w-[12px] rounded-full bg-{getStatusColor(status)}" />
						</div>
						<div class="ml-1.5 flex min-w-0 flex-grow flex-col items-start">
							<span
								class="w-full truncate text-left 
                        text-[14px] font-semibold leading-[18px] text-default"
							>
								{getStatusName(status)}
							</span>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</DropdownBase>
</div>
