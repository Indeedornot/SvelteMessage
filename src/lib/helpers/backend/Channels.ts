import { io } from '$lib/backend/socketio/socket-client';
import { trpc } from '$lib/backend/trpc/client';
import {
	ApiToMsgData,
	type ChannelCreateApiData,
	type ChannelData,
	type ChannelUpdateApiData,
	type MessageData,
	type UserData
} from '$lib/models';
import { UserStore, UsersCache } from '$lib/stores';
import { get } from 'svelte/store';

import { browserUtils } from '../jsUtils';
import { getUserById } from './User';

export const addChannelListener = () => {
	io.on('ChannelChanged', async (channelId: number, data: ChannelUpdateApiData) => {
		UserStore.crud.channels.update(channelId, data);
	});

	io.on('ChannelNewJoined', async (userId: number) => {
		const user = await getUserById(userId);
		UsersCache.crud.add(user);
	});

	io.on('ChannelRemoved', (channelId: number) => {
		UserStore.crud.channels.remove(channelId);
	});

	io.on('ChannelLeft', (userId: number) => {
		UsersCache.crud.remove(userId);
	});
};

export const switchChannel = (channelId: number): Promise<void> => {
	return new Promise((resolve, reject) => {
		const user = get(UserStore);
		if (!user) {
			reject();
			return;
		}

		browserUtils.log('switchChannel', channelId);
		io.emit('ChannelSwitch', channelId);
		io.once('ChannelFinishedSwitching', () => {
			// UserStore.crud.channels
			console.log('ChannelFinishedSwitching');

			resolve();
		});
	});
};

/** Does not set lastChannelId */
export const joinNewChannel = (channelId: number): Promise<void> => {
	return new Promise((resolve, reject) => {
		const user = get(UserStore);
		if (!user) {
			reject();
			return;
		}

		io.emit('ChannelNewJoining', channelId);
		io.once('ChannelNewFinishedJoining', () => {
			browserUtils.log('ChannelNewFinishedJoining');
			resolve();
		});
	});
};

/** Handles lastChannelId */
export const leaveChannel = (channelId: number): Promise<void> => {
	return new Promise((resolve, reject) => {
		const user = get(UserStore);
		if (!user) {
			reject();
			return;
		}

		io.emit('ChannelLeft', channelId);
		io.once('ChannelFinishedLeaving', () => {
			UserStore.crud.channels.remove(channelId);
			resolve();
		});
	});
};

export const fetchChannelByIdWithData = async (channelId: number) => {
	const currUser = get(UserStore);
	if (!currUser) return null;

	browserUtils.log('fetchChannelByIdWithData', channelId);
	const channel = await trpc().channel.getByIdWithData.query({ id: channelId, messageCount: 10 });
	if (!channel) return null;

	channel.users = channel.users.filter((user) => user.id !== currUser.id);
	const leftUsers: UserData[] = []; // users that are not in the channel anymore
	const MessagesData: MessageData[] = [];

	for (const message of channel.messages) {
		if (message.senderId === currUser.id) {
			MessagesData.push(ApiToMsgData(message, currUser));
			continue;
		}

		let sender = channel.users.find((user) => user.id === message.senderId);
		if (!sender) {
			sender = await getUserById(message.senderId);
			leftUsers.push(sender);
		}

		MessagesData.push(ApiToMsgData(message, sender));
	}

	console.group();
	console.table(channel.messages);
	console.table(MessagesData);
	console.groupEnd();

	return {
		left: leftUsers,
		messages: MessagesData,
		users: channel.users
	};
};

export const createChannel = async (data: ChannelCreateApiData): Promise<ChannelData> => {
	const channel = await trpc().channel.create.query(data);
	return channel;
};

export const getChannelById = async (channelId: number): Promise<ChannelData | null> => {
	return await trpc().channel.getById.query(channelId);
};

export const getChannels = async (userId: number) => {
	const channels = await trpc().channel.getByUserId.query(userId);
	return channels;
};
