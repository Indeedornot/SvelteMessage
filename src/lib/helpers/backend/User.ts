import { io } from '$lib/backend/socketio/socket-client';
import { trpc } from '$lib/backend/trpc/client';
import type { CurrUserData, UserChangedData, UserData, UserSocketData } from '$lib/models';
import { UsersCache } from '$lib/stores';

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
		channels: user.channels.map((channel) => channel.id)
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
		const currUserData: CurrUserData = await trpc().user.getByIdWithData.query(userId);
		return currUserData;
	}

	const newUserData = await trpc()
		.user.create.query()
		.then((data) => {
			setUserData(data.id);
			return data;
		});

	return newUserData;
};

export const updateUser = (data: UserChangedData): Promise<UserChangedData> => {
	return new Promise((resolve) => {
		io.emit('UserChanged', data);
		io.once('UserFinishedChanging', (data) => {
			resolve(data);
		});
	});
};

export const getUserById = async (userId: number): Promise<UserData> => {
	browserUtils.log('getUserById', userId);
	return await trpc().user.getById.query(userId);
};
