import { io } from '$lib/backend/socketio/socket-client';
import { trpc } from '$lib/backend/trpc/client';
import {
	ApiToMsgData,
	type ChannelCreateData,
	type ChannelData,
	type ChannelUpdateApiData,
	type MessageData,
	type UserData
} from '$lib/models';
import { ChannelStore, ChannelsCache, LeftUsersStore, MessageCache, UserStore, UsersCache } from '$lib/stores';
import { get } from 'svelte/store';

import { browserUtils, updateRef } from '../jsUtils';
import { getChannelUserByData, getUserById } from './User';

export const addChannelListener = () => {
	io.on('ChannelChanged', async (data: ChannelUpdateApiData) => {
		ChannelsCache.crud.update(data);
	});

	io.on('ChannelNewJoined', async (userId: number) => {
		const currChannel = get(ChannelStore);
		if (!currChannel) return;

		const oldUser = LeftUsersStore.crud.remove(userId);
		const user = await getUserById(userId, currChannel.id);

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
		ChannelsCache.crud.remove(channelId);
	});

	io.on('ChannelLeft', (userId: number) => {
		const user = UsersCache.crud.remove(userId);
		if (!user) return;

		LeftUsersStore.crud.addObj(user);
	});
};

export const switchChannel = async (channelId: number) => {
	const storedUser = get(UserStore);
	if (!storedUser) return;

	const newChannel = get(ChannelsCache).find((channel) => channel.id === channelId);
	const newChannelUser = await getChannelUserByData(channelId, storedUser.id);
	if (!newChannel || !newChannelUser) {
		ChannelStore.crud.set(null);
		UserStore.crud.channelUser.set(null);
		return;
	}

	//if it isn't initial set
	const success = await new Promise((resolve) => {
		browserUtils.log('switchChannel', channelId);
		io.emit('ChannelSwitch', channelId);
		io.once('ChannelFinishedSwitching', (success) => {
			// UserStore.crud.channels
			console.log('ChannelFinishedSwitching');
			resolve(success);
		});
	});
	if (!success) {
		ChannelStore.crud.set(null);
		UserStore.crud.channelUser.set(null);
		return;
	}

	await fetchChannelData(channelId);

	ChannelStore.crud.set(newChannel);
	UserStore.crud.channelUser.set(newChannelUser);
};

export const fetchChannelData = async (channelId: number) => {
	const channel = await fetchChannelByIdWithData(channelId);
	if (!channel) {
		ChannelStore.crud.set(null);
		UserStore.crud.channelUser.set(null);
		return;
	}

	LeftUsersStore.crud.set(channel.left);
	UsersCache.crud.set(channel.users);
	MessageCache.crud.set(channel.messages);
};

/** Does not set currData */
export const joinNewChannel = (channelId: number): Promise<boolean> => {
	return new Promise((resolve) => {
		const user = get(UserStore);
		if (!user) {
			resolve(false);
			return;
		}

		io.emit('ChannelNewJoining', channelId);
		io.once('ChannelNewFinishedJoining', async () => {
			const channel = await getChannelById(channelId);
			if (!channel) {
				resolve(false);
				return;
			}

			ChannelsCache.crud.add(channel);

			browserUtils.log('ChannelNewFinishedJoining');

			resolve(true);
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

		const currChannel = get(ChannelStore);
		if (!currChannel) return;

		io.emit('ChannelLeft', channelId);
		io.once('ChannelFinishedLeaving', (success) => {
			if (!success) {
				reject();
				return;
			}

			if (currChannel.id === channelId) {
				UserStore.crud.channelUser.set(null);
				UsersCache.crud.clear();
				MessageCache.crud.clear();
			}

			resolve();
		});

		ChannelsCache.crud.remove(channelId);
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
				sender = await getUserById(message.senderId, channelId);
				leftUsers.push(sender);
			}
		}

		MessagesData.push(ApiToMsgData(message, sender));
	}

	return {
		left: leftUsers,
		messages: MessagesData,
		users: channel.users,
		roles: channel.roles
	};
};

export const createChannel = async (data: ChannelCreateData) => {
	const channel = await trpc().channel.create.query(data);
	await joinNewChannel(channel.id);
	ChannelsCache.crud.add(channel);
};

export const getChannelById = async (channelId: number): Promise<ChannelData | null> => {
	return await trpc().channel.getById.query(channelId);
};

export const getChannels = async (userId: number) => {
	const channels = await trpc().channel.getByUserId.query(userId);
	return channels;
};
