import { io } from '$lib/backend/socketio/socket-client';
import {
	ApiToMsgData,
	type MessageApiData,
	type MessageChangedData,
	type MessageCreateApiData,
	type MessageUpdateApiData,
	type UserData
} from '$lib/models';
import { MessageCache, UserStore, UsersCache } from '$lib/stores';
import { get } from 'svelte/store';

import { browserUtils } from '../jsUtils';

export const addMessageListener = () => {
	io.on('Message', async (message: MessageApiData) => {
		browserUtils.log('Message', message);

		const currUser = get(UserStore);
		if (message.senderId === currUser?.id) {
			MessageCache.crud.add(ApiToMsgData(message, currUser));
			return ApiToMsgData(message, currUser);
		}

		const usersCache: UserData[] = get(UsersCache);
		const user = usersCache.find((user) => user.id === message.senderId);
		if (!user) return;

		MessageCache.crud.add(ApiToMsgData(message, user));
		return ApiToMsgData(message, user);
	});

	io.on('MessageDeleted', (messageId: number) => {
		MessageCache.crud.remove(messageId);
	});

	io.on('MessageChanged', (messageId, message) => {
		MessageCache.crud.update(messageId, message);
	});
};

export const sendNewMessage = (message: MessageCreateApiData) => {
	io.emit('Message', message);
};

export const changeMessage = (messageId: number, message: MessageChangedData): Promise<MessageUpdateApiData> => {
	return new Promise((resolve) => {
		io.emit('MessageChanged', messageId, message);
		io.once('MessageFinishedChanging', (message: MessageUpdateApiData) => {
			resolve(message);
		});
	});
};

export const deleteMessage = (messageId: number) => {
	io.emit('MessageDeleted', messageId);
};
