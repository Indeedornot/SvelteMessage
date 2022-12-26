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
import { LeftUsersStore, MessageCache, UserStore, UsersCache } from '$lib/stores';
import { get } from 'svelte/store';

import { browserUtils, updateRef } from '../jsUtils';
import { getUserById } from './User';

export const addChannelListener = () => {
	io.on('ChannelChanged', async (channelId: number, data: ChannelUpdateApiData) => {
		UserStore.crud.channels.update(channelId, data);
	});

	io.on('ChannelNewJoined', async (userId: number) => {
		const oldUser = LeftUsersStore.crud.remove(userId);
		const user = await getUserById(userId);

		if (oldUser) {
			//since oldUser is still attached to messages, we need to update it
			browserUtils.log('ChannelNewJoined', oldUser, user);
			updateRef(oldUser, user);
			UsersCache.crud.addObj(oldUser);
			MessageCache.crud.causeUpdate();
			return;
		}

		UsersCache.crud.addObj(user);
	});

	io.on('ChannelRemoved', (channelId: number) => {
		UserStore.crud.channels.remove(channelId);
	});

	io.on('ChannelLeft', (userId: number) => {
		const user = UsersCache.crud.remove(userId);
		if (!user) return;

		LeftUsersStore.crud.addObj(user);
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

/** Does not set currChannelId */
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

/** Handles currChannelId */
export const leaveChannel = (channelId: number): Promise<void> => {
	return new Promise((resolve, reject) => {
		const user = get(UserStore);
		if (!user) {
			reject();
			return;
		}

		io.emit('ChannelLeft', channelId);
		io.once('ChannelFinishedLeaving', () => {
			resolve();
		});
	});
};

export const fetchChannelByIdWithData = async (channelId: number) => {
	const currUser = get(UserStore);
	if (!currUser) return null;

	browserUtils.log('fetchChannelByIdWithData', channelId);
	const channel = await trpc().channel.getByIdWithData.query({
		id: channelId,
		messageCount: 10,
		excludeId: currUser.id
	});
	if (!channel) return null;

	const leftUsers: UserData[] = []; // users that are not in the channel anymore
	const MessagesData: MessageData[] = [];

	for (const message of channel.messages) {
		if (message.senderId === currUser.id) {
			MessagesData.push(ApiToMsgData(message, currUser));
			continue;
		}

		//is in channel users
		let sender = channel.users.find((user) => user.id === message.senderId);
		if (!sender) {
			//is cached in leftUsers
			sender = leftUsers.find((user) => user.id === message.senderId);
			if (!sender) {
				//is not cached in leftUsers -> fetch from server
				sender = await getUserById(message.senderId);
				leftUsers.push(sender);
			}
		}

		MessagesData.push(ApiToMsgData(message, sender));
	}

	return {
		left: leftUsers,
		messages: MessagesData,
		users: channel.users,
		ownerId: channel.ownerId
	};
};

export const createChannel = async (data: ChannelCreateApiData): Promise<ChannelData> => {
	const channel = await trpc().channel.create.query(data);
	await joinNewChannel(channel.id);
	UserStore.crud.channels.addObj(channel);
	return channel;
};

export const getChannelById = async (channelId: number): Promise<ChannelData | null> => {
	return await trpc().channel.getById.query(channelId);
};

export const getChannels = async (userId: number) => {
	const channels = await trpc().channel.getByUserId.query(userId);
	return channels;
};
