import { io } from '$lib/backend/socketio/socket-client';
import { trpc } from '$lib/backend/trpc/client';
import type { ChannelData, UserApiData, UserChangedData, UserData, UserSocketData } from '$lib/models';
import { ChannelStore, ChannelsCache, UserStore, UsersCache } from '$lib/stores';
import { get } from 'svelte/store';

import { getUserData, setUserData } from '../DataStore';
import { browserUtils } from '../jsUtils';
import { fetchChannelData } from './Channels';

export const fetchUser = async (makeOnline: boolean) => {
	return await getSelfUser().then(async (u) => {
		makeOnline && (await goOnline(u));
		if (u.currChannelId) {
			await fetchChannelData(u.currChannelId);
		}

		return u;
	});
};

const goOnline = (user: UserData): Promise<void> => {
	return new Promise<void>((resolve) => {
		const socketUser = currUserToSocket();
		io.emit('Connected', socketUser);
		io.once('Connected', () => {
			user.online = true;
			resolve();
		});
	});
};

const currUserToSocket = (): UserSocketData => {
	const user = get(UserStore);
	const channels = get(ChannelsCache);
	const channel = get(ChannelStore);

	if (!user) throw new Error('User is null');
	if (!channels) throw new Error('Channels is null');

	return {
		...user,
		channels: channels.map((channel) => channel.id),
		channel: channel
	};
};

export const addUserListener = () => {
	io.on('UserOnline', (userId: number) => {
		UsersCache.status.setOnline(userId);
	});

	io.on('UserOffline', (userId: number) => {
		UsersCache.status.setOffline(userId);
	});

	io.on('UserChanged', (userId: number, data: UserChangedData) => {
		UsersCache.crud.update(userId, data);
	});
};

const getSelfUser = async (): Promise<UserApiData> => {
	const userId = getUserData();

	let userData: UserApiData;
	let channels: ChannelData[] = [];
	let channel: ChannelData | null = null;
	if (!userId) {
		userData = await trpc()
			.user.create.query()
			.then((data) => {
				setUserData(data.id);
				return data;
			});
	} else {
		userData = await trpc().user.getCurrUserById.query(userId);

		channels = await trpc().channel.getByUserId.query(userId);
		if (userData.channelUser) {
			channel = channels.find((channel) => channel.id === userData.currChannelId) || null;
		}
	}

	UserStore.crud.set(userData);
	ChannelsCache.crud.set(channels);
	ChannelStore.crud.set(channel);

	return userData;
};

export const updateUser = async (changeData: UserChangedData) => {
	const user = get(UserStore);
	if (!user) return;
	const updateData = await new Promise<UserChangedData>((resolve) => {
		io.emit('UserChanged', changeData);
		io.once('UserFinishedChanging', (data) => {
			resolve(data);
		});
	});

	UserStore.crud.update(updateData);
};

export const getUserById = async (userId: number, channelId: number): Promise<UserData> => {
	browserUtils.log('getUserById', userId);
	return await trpc().user.getById.query({
		channelId: channelId,
		id: userId
	});
};

export const getChannelUserById = async (channelUserId: number) => {
	return await trpc().channelUser.getById.query(channelUserId);
};

export const getChannelUserByData = async (channelId: number, userId: number) => {
	return await trpc().channelUser.getByData.query({
		channelId: channelId,
		userId: userId
	});
};
