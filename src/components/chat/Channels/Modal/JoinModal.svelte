<script lang="ts">
	import { Exit } from '$components/icons';
	import { joinNewChannel } from '$lib/helpers/backend';
	import { idSchema } from '$lib/models';
	import { UserStore } from '$lib/stores';

	export let closeModal: () => void;
	export let join = {
		open: false,
		pending: false,
		data: {
			channelId: ''
		}
	};

	const joinChannel = async () => {
		if (join.pending) return;
		const id = parseInt(join.data.channelId);
		if (isNaN(id)) return;

		const parseData = idSchema.safeParse(id);
		if (!parseData.success) return;

		join.pending = true;
		const result = await joinNewChannel(parseData.data);
		if (result) {
			join.data.channelId = '';
		}

		join.pending = false;
		closeModal();
	};

	const closeSelf = () => {
		join.data.channelId = '';
		join.open = false;
	};
</script>

<div class="shadow-lg absolute flex w-full max-w-md flex-col rounded-lg bg-overlay px-4 py-6">
	<div class="mb-2 flex flex-none justify-between">
		<h2 class="text-2xl font-bold text-default">Join Channel</h2>
		<button class="text-muted hover:text-default" on:click={closeModal} disabled={join.pending}>
			<Exit size={24} />
		</button>
	</div>
	<p class="text-gray-700 mb-4 text-default">Enter the channel ID below to join:</p>
	<input
		type="text"
		class="m-0 mb-4 rounded border border-subtle bg-dark p-2.5 text-default"
		placeholder="Channel ID"
		disabled={join.pending}
		bind:value={join.data.channelId}
	/>
	<div class="flex items-center justify-between">
		<button
			class="focus:shadow-outline rounded-lg 
				px-2 py-2 
				font-bold text-muted 
				hover:underline focus:outline-none"
			on:click={closeSelf}
			disabled={join.pending}
		>
			Cancel
		</button>
		<button
			class="focus:shadow-outline efault rounded-lg 
				bg-blue-500 py-2 px-4 font-bold text-emphasis 
				transition-colors duration-200 
				hover:bg-blue-600 hover:text-default 
				focus:outline-none active:bg-blue-800"
			on:click={joinChannel}
			disabled={join.pending}
		>
			Join
		</button>
	</div>
</div>
