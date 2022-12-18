import { io } from '$lib/backend/socketio/socket-client';
import { trpc } from '$lib/backend/trpc/client';
import { type UserData, UserStatus, type UserUpdateData } from '$lib/models';
import { OnlineUsers, UsersCache } from '$lib/stores';

import { getUserData, setUserData, updateUserData } from '../DataStore';

export const getOnlineUsers = async (): Promise<UserData[]> => {
	return trpc().user.getByStatus.query(UserStatus.Online);
};

export const goOnline = (user: UserData): Promise<void> => {
	return new Promise<void>((resolve) => {
		io.emit('Connected', user);
		io.once('Connected', () => {
			resolve();
		});
	});
};

export const addUserListener = () => {
	io.on('UserOnline', (data: UserData) => {
		OnlineUsers.addUser(data);
		UsersCache.addOrUpdateUser(data);
	});

	io.on('UserOffline', (userId: number) => {
		OnlineUsers.removeUser(userId);
	});

	io.on('UserChanged', (userId: number, data: Partial<UserData>) => {
		OnlineUsers.updateUser(userId, data);
		UsersCache.updateUser(userId, data);
	});
};

export const getUser = async (): Promise<UserData> => {
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
