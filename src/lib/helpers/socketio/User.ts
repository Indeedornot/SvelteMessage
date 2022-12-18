import { io } from '$lib/backend/socketio/socket-client';
import { trpc } from '$lib/backend/trpc/client';
import { type UserData, UserStatus, UserToData } from '$lib/models';
import { OnlineUsers, UsersCache } from '$lib/stores/MessageCache';
import { get } from 'svelte/store';

import { getUserData, setUserData, updateUserData } from '../DataStore';

export const getOnlineUsers = async (): Promise<UserData[]> => {
	const users = await trpc().user.getByStatus.query(UserStatus.Online);
	return users.map(UserToData);
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
		UsersCache.updateUser(data.id, data);
	});

	io.on('UserOffline', (userId: number) => {
		OnlineUsers.removeUser(userId);
	});

	io.on('UserChanged', (userId: number, data: Partial<UserData>) => {
		OnlineUsers.updateUser(userId, data);
		UsersCache.updateUser(userId, data);
	});
};

export const getUser = (): Promise<UserData> => {
	return new Promise<UserData>((resolve) => {
		const userData = getUserData();
		console.log('userData', userData);

		if (userData) {
			resolve(userData);
			return;
		}

		io.emit('Name');
		io.once('Name', (newUser: UserData) => {
			setUserData(newUser);
			resolve(newUser);
		});
	});
};

export const updateUser = (data: Partial<UserData>): Promise<void> => {
	return new Promise<void>((resolve) => {
		io.emit('UserChanged', data);
		updateUserData(data);
		io.once('UserChanged', () => {
			resolve();
		});
	});
};
