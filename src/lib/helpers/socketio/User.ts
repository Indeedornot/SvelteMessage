import { io } from '$lib/backend/socketio/socket-client';
import { trpc } from '$lib/backend/trpc/client';
import type { UserData, UserUpdateData } from '$lib/models';
import { UsersCache } from '$lib/stores';

import { getUserData, setUserData, updateUserData } from '../DataStore';

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

	io.on('UserChanged', (userId: number, data: UserUpdateData) => {
		UsersCache.crud.update(userId, data);
	});
};

export const getSelfUser = async (): Promise<UserData> => {
	const userData = getUserData();
	console.log('userData', userData);

	if (userData) {
		return userData;
	}

	return await trpc()
		.user.create.query()
		.then((data) => {
			setUserData(data);
			return data;
		});
};

export const updateUser = (data: UserUpdateData): Promise<void> => {
	return new Promise<void>((resolve) => {
		io.emit('UserChanged', data);
		updateUserData(data);
		io.once('UserChanged', () => {
			resolve();
		});
	});
};

export const getUsers = async (): Promise<UserData[]> => {
	return await trpc().user.getAll.query();
};

export const getUserById = async (userId: number): Promise<UserData> => {
	return await trpc().user.getById.query(userId);
};
