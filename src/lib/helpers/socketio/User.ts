import type { UserData } from '$lib/models';
import { io } from '$lib/socketio/socket-client';

import { getUserData, setUserData, updateUserData } from '../DataStore';

export const getOnlineUsers = (): Promise<UserData[]> => {
	return new Promise<UserData[]>((resolve) => {
		io.emit('UsersOnline');
		io.once('UsersOnline', (data: UserData[]) => {
			resolve(data);
		});
	});
};

export const goOnline = (user: UserData): Promise<void> => {
	return new Promise<void>((resolve) => {
		io.emit('Connected', user);
		io.once('Connected', () => {
			resolve();
		});
	});
};

export const addUserListener = (
	onOnline: (data: UserData) => void,
	onOffline: (userId: number) => void,
	onUserChanged: (userId: number, data: Partial<UserData>) => void
) => {
	io.on('UserOnline', (data: UserData) => {
		onOnline(data);
	});

	io.on('UserOffline', (userId: number) => {
		onOffline(userId);
	});

	io.on('UserChanged', (userId: number, data: Partial<UserData>) => {
		onUserChanged(userId, data);
	});
};

export const getName = (): Promise<UserData> => {
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
