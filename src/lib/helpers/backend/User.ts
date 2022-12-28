import { io } from '$lib/backend/socketio/socket-client';
import { trpc } from '$lib/backend/trpc/client';
import type { CurrUserApiData, CurrUserData, UserChangedData, UserData, UserSocketData } from '$lib/models';
import { UserStore, UsersCache } from '$lib/stores';
import { get } from 'svelte/store';

import { getUserData, setUserData } from '../DataStore';
import { browserUtils } from '../jsUtils';

export const goOnline = (user: CurrUserData): Promise<void> => {
	return new Promise<void>((resolve) => {
		const socketUser = currUserToSocket(user);
		io.emit('Connected', socketUser);
		io.once('Connected', () => {
			user.online = true;
			resolve();
		});
	});
};

const currUserToSocket = (user: CurrUserData): UserSocketData => {
	return {
		...user,
		channels: user.channels.map((channel) => {
			return {
				id: channel.id,
				roles: channel.roles.map((role) => {
					return {
						id: role.id,
						permissions: role.permissions,
						order: role.order
					};
				})
			};
		})
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

export const getSelfUser = async (): Promise<CurrUserData> => {
	const userId = getUserData();

	if (userId) {
		const userApiData: CurrUserApiData = await trpc().user.getByIdWithData.query(userId);
		return apiToCurrUser(userApiData);
	}

	const newUserData = await trpc()
		.user.create.query()
		.then((data) => {
			setUserData(data.id);
			return data;
		});

	return apiToCurrUser(newUserData);
};

export const apiToCurrUser = (userApiData: CurrUserApiData): CurrUserData => {
	const currChannel = userApiData.channels.find((channel) => channel.id === userApiData.currChannelId);
	const currChannelUser = userApiData.channelUsers.find((cUser) => cUser.channelId === userApiData.currChannelId);

	const currUserData: CurrUserData = {
		...userApiData,
		currData: null
	};

	if (currChannel && currChannelUser) {
		currUserData.currData = {
			channel: currChannel,
			channelUser: currChannelUser
		};
	}

	return currUserData;
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
