<script lang="ts">
	import { browser } from '$app/environment';
	import { getUserData, setUserData } from '$lib/helpers/DataStore';
	import { MessageData } from '$lib/models/MessageData';
	import { sampleMessages } from '$lib/models/SampleData';
	import { UserData } from '$lib/models/UserData';
	import { io } from '$lib/socketio/socket-client';
	import { onDestroy, onMount } from 'svelte';

	import Avatar from './Avatar.svelte';
	import Message from './Message.svelte';
	import SendBar from './SendBar.svelte';

	let messages: MessageData[] = sampleMessages;
	let user: UserData;

	let onlineUsers: Set<UserData> = new Set();

	onMount(() => {
		if (!browser) return;
		addEventListeners();
	});

	const addEventListeners = async () => {
		const onlineUsrs = await getOnlineUsers();
		onlineUsers = new Set(onlineUsrs);

		user = await getOrListenForName();
		goOnline();

		onlineUsers.add(user);
		console.log('onlineUsers', onlineUsers);

		addMessageListener();
	};

	const goOnline = () => {
		io.emit('Connected', user);
	};

	const getOnlineUsers = (): Promise<UserData[]> => {
		return new Promise<UserData[]>((resolve) => {
			io.emit('UsersOnline');
			io.once('UsersOnline', (data: UserData[]) => {
				resolve(data);
			});
		});
	};

	const getOrListenForName = (): Promise<UserData> => {
		return new Promise<UserData>((resolve) => {
			let userData = getUserData();
			console.log('userData', userData);

			if (userData) {
				resolve(userData);
			}

			io.emit('Name');
			io.once('Name', (id: string) => {
				userData = new UserData({ id: id });
				setUserData(userData);
				resolve(userData);
			});
		});
	};

	const addMessageListener = () => {
		io.on('Message', (message: MessageData) => {
			const data = new MessageData({ ...message });
			console.log('received message from server', data);
		});
	};

	const sendMessage = (text: string) => {
		const data = new MessageData({ text: text, sender: user });
		messages = [...messages, data];

		console.log('sending message to server', data);

		io.emit('Message', data);
	};

	onDestroy(() => {
		io.emit('UserOffline');
	});

	$: console.log('online users', onlineUsers);
</script>

<div class="flex h-full w-full flex-none flex-col border-2 border-subtle">
	<div class="box-border h-[52px] border-b-2 border-emphasis bg-dark px-3.5">
		<div class="flex h-full w-full flex-none items-center">
			<Avatar width={32} height={32} src={user?.avatar} />
			<div class="ml-1 flex flex-col">
				<span class="text-[14px] font-semibold leading-[18px] text-default">{user?.name}</span>
				<span class="text-[12px] leading-[16px] text-muted">{user?.id}</span>
			</div>
		</div>
	</div>
	<!-- Header -->
	<div class="box-border flex min-h-0 flex-grow flex-col bg-default">
		<div class="messages flex w-full flex-grow flex-col overflow-y-auto">
			{#each messages as message (message.id)}
				<Message data={message} />
			{/each}
		</div>
		<div class="mb-2 px-2.5 pb-2">
			<SendBar onSumbit={sendMessage} />
		</div>
	</div>
</div>

<style>
	.messages > :global(:not(:last-child)) {
		padding-bottom: 12px;
	}

	.messages > :global(:first-child) {
		padding-top: 12px;
	}

	.messages > :global(*) {
		padding-left: 10px;
		padding-right: 10px;
	}
</style>
