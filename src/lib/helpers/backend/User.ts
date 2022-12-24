import { io } from '$lib/backend/socketio/socket-client';
import { trpc } from '$lib/backend/trpc/client';
import type { CurrUserData, UserChangedData, UserData } from '$lib/models';
import { UsersCache } from '$lib/stores';

import { getUserData, setUserData, updateUserData } from '../DataStore';
import { browserUtils } from '../jsUtils';
import { getChannels } from './Channels';

export const goOnline = (user: UserData): Promise<void> => {
	return new Promise<void>((resolve) => {
		io.emit('Connected', user);
		io.once('Connected', () => {
			user.online = true;
			resolve();
		});
	});
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

export const getSelfUser = async (): Promise<UserData> => {
	const userData = getUserData();
	console.log('userData', userData);

	if (userData) {
		console.log('userData return', userData);

		return userData;
	}

	const newUserData = await trpc()
		.user.create.query()
		.then((data) => {
			setUserData(data);
			return data;
		});

	console.log('newUserData', newUserData);

	return newUserData;
};

export const userToCurrUser = async (user: UserData): Promise<CurrUserData> => {
	const channels = await getChannels(user.id);
	return {
		...user,
		channels
	};
};

export const updateUser = (data: UserChangedData): Promise<UserChangedData> => {
	return new Promise((resolve) => {
		io.emit('UserChanged', data);
		updateUserData(data);
		io.once('UserFinishedChanging', (data) => {
			resolve(data);
		});
	});
};

export const getUsers = async (): Promise<UserData[]> => {
	return await trpc().user.getAll.query();
};

export const getUserById = async (userId: number): Promise<UserData> => {
	browserUtils.log('getUserById', userId);
	return await trpc().user.getById.query(userId);
};
