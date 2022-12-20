import { updateRef } from '$lib/helpers/jsUtils';
import { changeMessage, deleteMessage, getMessages } from '$lib/helpers/socketio/Messages';
import type { MessageChangedData, MessageData, MessageUpdateApiData } from '$lib/models';
import { get, writable } from 'svelte/store';

import { UserStore, UsersCache } from './User';

const createMessageStore = () => {
	const { subscribe, set, update } = writable<MessageData[]>([]);

	//Since I use the reference to user on a MessageData,
	//i need to manually send notification from store
	UserStore.subscribe(() => {
		update((messages) => {
			return messages;
		});
	});

	UsersCache.subscribe(() => {
		update((messages) => {
			return messages;
		});
	});

	return {
		subscribe,
		set,
		update,
		addMessage: (message: MessageData) => update((messages) => [...messages, message]),
		removeMessage: (messageId: number) => {
			update((messages) => {
				deleteMessage(messageId);
				return messages.filter((message) => message.id !== messageId);
			});
		},
		changeMessage: async (messageId: number, data: MessageChangedData) => {
			const message = get(MessageCache).find((message) => message.id === messageId);
			if (!message) return;

			const updateData = await changeMessage(messageId, data);

			update((messages) => {
				updateRef(message, updateData);
				return messages;
			});
		},
		updateMessage: (messageId: number, data: MessageUpdateApiData) => {
			update((messages) => {
				console.log('Msg UPT', messageId, data);

				const message = messages.find((message) => message.id === messageId);
				if (!message) return messages;

				updateRef(message, data);
				return messages;
			});
		},
		fetchMessages: async () => {
			const messages = await getMessages();
			set(messages);
		}
	};
};

export const MessageCache = createMessageStore();
