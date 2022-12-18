import { io } from '$lib/backend/socketio/socket-client';
import { trpc } from '$lib/backend/trpc/client';
import {
	type MessageApiData,
	type MessageCreateApiData,
	type MessageData,
	type UserData,
	UserToData
} from '$lib/models';
import { MessageCache, UsersCache } from '$lib/stores/MessageCache';
import { get } from 'svelte/store';

export const getMessages = async () => {
	const userCache: UserData[] = get(UsersCache);
	if (userCache.length === 0) {
		return await trpc()
			.message.getMessagesWithSender.query(10)
			.then((data) => {
				// remove duplicates
				const senders: Set<UserData> = new Set();
				data.forEach((message) => {
					senders.add(message.sender);
				});

				senders.forEach((sender) => {
					UsersCache.addUser(sender);
				});

				return data;
			});
	}

	return await trpc()
		.message.getMessages.query(10)
		.then(async (data) => {
			const senders: Set<UserData> = new Set();
			const messages = await Promise.all(
				data.map(async (message) => {
					let setSender: UserData | undefined;
					for (const sender of senders) {
						if (sender.id === message.senderId) {
							setSender = sender;
							break;
						}
					}

					if (setSender) {
						return ApiToMsgData(message, setSender);
					}

					const sender = userCache.find((user) => user.id === message.senderId);
					if (sender) {
						senders.add(sender);
						return ApiToMsgData(message, sender);
					}

					return await trpc()
						.user.getById.query(message.senderId)
						.then((user) => {
							const userData = UserToData(user);
							UsersCache.addUser(userData);
							return ApiToMsgData(message, userData);
						});
				})
			);

			return messages;
		});
};

export const addMessageListener = () => {
	io.on('Message', async (message: MessageApiData) => {
		const userCache: UserData[] = get(UsersCache);
		let user = userCache.find((user) => user.id === message.senderId);

		if (user) {
			MessageCache.addMessage(ApiToMsgData(message, user));
		}

		user = await trpc()
			.user.getById.query(message.senderId)
			.then((user) => {
				UsersCache.addUser(user);
				return user;
			});
		if (!user) {
			console.error('User not found');
			return;
		}

		MessageCache.addMessage(ApiToMsgData(message, user));
	});
};

export const sendNewMessage = (message: MessageCreateApiData) => {
	io.emit('Message', message);
};

//! To see if I can set type of trpc return to return date on timestamp
const ApiToMsgData = (message: MessageApiData, user: UserData): MessageData => {
	return {
		id: message.id,
		text: message.text,
		timestamp: message.timestamp,
		sender: user
	};
};
