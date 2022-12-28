<script lang="ts">
	import Avatar from '$components/chat/Avatar.svelte';
	import { Exit } from '$components/icons';
	import { generateRandomAvatar } from '$lib/helpers/RandomAvatar';
	import { createChannel as createChannelApi } from '$lib/helpers/backend/Channels';
	import { ChannelCreateSchema, avatarSchema } from '$lib/models';
	import { UserStore } from '$lib/stores';

	export let create: {
		open: boolean;
		pending: boolean;
		data: {
			name: string;
			avatar: string;
		};
	};
	let parsedAvatar: string | undefined;

	export let closeModal: () => void;

	const createChannel = async () => {
		if (create.pending) return;
		const currUser = $UserStore;
		if (!currUser) return;

		const parseData = ChannelCreateSchema.safeParse({ ...create.data, creatorId: currUser.id });
		if (!parseData.success) {
			console.log(parseData.error);
			return;
		}

		create.pending = true;
		await createChannelApi(parseData.data);
		create.pending = false;
		closeModal();
	};

	const closeSelf = () => {
		create.data.name = '';
		create.data.avatar = '';
		create.open = false;
	};
</script>

<div class="shadow-lg absolute flex w-full max-w-md flex-col rounded-lg bg-overlay px-4 py-6">
	<div class="mb-2 flex flex-none justify-between">
		<h2 class="text-2xl font-bold text-default">Create Server</h2>
		<button class="text-muted hover:text-default" on:click={closeModal} disabled={create.pending}>
			<Exit size={24} />
		</button>
	</div>
	<p class="mb-4 text-default">Enter the name of the server and avatar:</p>
	<span class="mb-4 flex flex-none flex-col gap-2">
		<div class="flex w-full flex-none justify-center">
			<div class="isolation grid child:col-start-1 child:row-start-1">
				<button
					on:click={() => {
						parsedAvatar = generateRandomAvatar();
						create.data.avatar = parsedAvatar;
					}}
					class="group relative grid rounded-full child:col-start-1 child:row-start-1"
				>
					<Avatar height={64} width={64} src={parsedAvatar} />
					<div class="h-[64px] w-[64px] rounded-full group-hover:bg-default/50 group-active:bg-dark/75" />
				</button>
				<button
					class="z-[1] h-fit justify-self-end rounded-full bg-icon hover:bg-emphasis"
					on:click={() => {
						parsedAvatar = undefined;
						create.data.avatar = '';
					}}
				>
					<Exit />
				</button>
			</div>
		</div>
		<input
			type="text"
			class="m-0 rounded border border-subtle bg-dark p-2.5 text-default"
			placeholder="Channel Avatar"
			bind:value={create.data.avatar}
			on:input={() => {
				const parsedData = avatarSchema.safeParse(create.data.avatar);

				if (!parsedData.success) {
					parsedAvatar = undefined;
					return;
				}

				parsedAvatar = parsedData.data;
			}}
		/>
		<input
			type="text"
			class="m-0 rounded border border-subtle bg-dark p-2.5 text-default"
			placeholder="Channel Name"
			bind:value={create.data.name}
		/>
	</span>

	<div class="flex items-center justify-between">
		<button
			class="focus:shadow-outline rounded-lg 
				px-2 py-2 
				font-bold text-muted 
				hover:underline focus:outline-none"
			on:click={closeSelf}
			disabled={create.pending}
		>
			Cancel
		</button>
		<button
			class="focus:shadow-outline efault rounded-lg 
				bg-blue-500 py-2 px-4 font-bold text-emphasis 
				transition-colors duration-200 
				hover:bg-blue-600 hover:text-default 
				focus:outline-none active:bg-blue-800"
			on:click={createChannel}
			disabled={create.pending}
		>
			Create
		</button>
	</div>
</div>
