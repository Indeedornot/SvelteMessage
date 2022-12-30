import { browserUtils } from '$lib/helpers/jsUtils';
import {
	ApiToMsgData,
	type MessageApiData,
	type MessageChangedData,
	type MessageCreateData,
	type MessageUpdateData,
	type UserData
} from '$lib/models';
import { MessageCache, UserStore, UsersCache } from '$lib/stores';
import { get } from 'svelte/store';

import { io } from './clients';

export const addMessageListener = () => {
	io.on('Message', async (message: MessageApiData) => {
		browserUtils.log('Message', message);

		const currUser = get(UserStore);
		if (message.senderId === currUser?.id) {
			MessageCache.crud.add(ApiToMsgData(message, currUser));
			return;
		}

		const usersCache: UserData[] = get(UsersCache);
		const user = usersCache.find((user) => user.id === message.senderId);
		if (!user) return;

		MessageCache.crud.add(ApiToMsgData(message, user));
	});

	io.on('MessageDeleted', (messageId: number) => {
		MessageCache.crud.remove(messageId);
	});

	io.on('MessageChanged', (messageId, message) => {
		MessageCache.crud.update(messageId, message);
	});
};

export const sendNewMessage = (message: MessageCreateData) => {
	io.emit('Message', message);
	// MessageCache.crud.add(message);
};

export const changeMessage = async (messageId: number, messageChange: MessageChangedData) => {
	const storedMessage = get(MessageCache).find((message) => message.id === messageId);
	if (!storedMessage) return;

	const messageUpdate = await new Promise<MessageUpdateData>((resolve) => {
		io.emit('MessageChanged', messageId, messageChange);
		io.once('MessageFinishedChanging', (message: MessageUpdateData) => {
			resolve(message);
		});
	});

	MessageCache.crud.update(messageId, messageUpdate);
};

export const deleteMessage = (messageId: number) => {
	io.emit('MessageDeleted', messageId);
	MessageCache.crud.remove(messageId);
};
