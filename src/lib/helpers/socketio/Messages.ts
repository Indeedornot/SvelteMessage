import { io } from '$lib/backend/socketio/socket-client';
import { trpc } from '$lib/backend/trpc/client';
import type { MessageApiData, MessageChangedData, MessageCreateApiData, MessageData, UserData } from '$lib/models';
import { MessageCache, UserStore, UsersCache } from '$lib/stores';
import { get } from 'svelte/store';

export const getMessages = async () => {
	const userCache: UserData[] = get(UsersCache);
	if (userCache.length === 0) {
		await UsersCache.fetchUsers();
	}

	return await trpc()
		.message.getMessages.query(10)
		.then(async (data) => {
			const senders: Set<UserData> = new Set();
			const meUser = get(UserStore);
			const messages = await Promise.all(
				data.map(async (message) => {
					if (message.senderId === meUser?.id) {
						return ApiToMsgData(message, meUser);
					}

					for (const sender of senders) {
						if (sender.id !== message.senderId) continue;
						return ApiToMsgData(message, sender);
					}

					const sender = userCache.find((user) => user.id === message.senderId);
					if (sender) {
						senders.add(sender);
						return ApiToMsgData(message, sender);
					}

					return await trpc()
						.user.getById.query(message.senderId)
						.then((user) => {
							UsersCache.addUser(user);
							return ApiToMsgData(message, user);
						});
				})
			);

			return messages;
		});
};

export const addMessageListener = () => {
	io.on('Message', async (message: MessageApiData) => {
		console.log('Msg STC', message);

		const meUser = get(UserStore);
		if (message.senderId === meUser?.id) {
			MessageCache.addMessage(ApiToMsgData(message, meUser));
			return ApiToMsgData(message, meUser);
		}

		const userCache: UserData[] = get(UsersCache);
		const user = userCache.find((user) => user.id === message.senderId);
		if (user) {
			MessageCache.addMessage(ApiToMsgData(message, user));
			return ApiToMsgData(message, user);
		}

		await trpc()
			.user.getById.query(message.senderId)
			.then((user) => {
				UsersCache.addUser(user);
				MessageCache.addMessage(ApiToMsgData(message, user));

				return user;
			});
	});

	io.on('MessageDeleted', (messageId: number) => {
		MessageCache.removeMessage(messageId);
	});

	io.on('MessageChanged', (messageId, message) => {
		MessageCache.updateMessage(messageId, message);
	});
};

export const sendNewMessage = (message: MessageCreateApiData) => {
	io.emit('Message', message);
};

export const changeMessage = (messageId: number, message: MessageChangedData) => {
	io.emit('MessageChanged', messageId, message);
};

const ApiToMsgData = (message: MessageApiData, user: UserData): MessageData => {
	return {
		id: message.id,
		text: message.text,
		timestamp: message.timestamp,
		sender: user
	};
};
