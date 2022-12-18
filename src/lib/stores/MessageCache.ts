import { getMessages } from '$lib/helpers/socketio/Messages';
import type { MessageData } from '$lib/models';
import { writable } from 'svelte/store';

import { UserStore, UsersCache } from './User';

const createMessageStore = () => {
	const { subscribe, set, update } = writable<MessageData[]>([]);

	//Since I use the reference to user on a MessageData,
	//i need to manually send notification from store
	UserStore.subscribe(() => {
		update((messages) => {
			return [...messages];
		});
	});

	UsersCache.subscribe(() => {
		update((messages) => {
			return [...messages];
		});
	});

	return {
		subscribe,
		set,
		update,
		addMessage: (message: MessageData) => update((messages) => [...messages, message]),
		removeMessage: (messageId: number) => update((messages) => messages.filter((message) => message.id !== messageId)),
		updateMessage: (messageId: number, data: Partial<MessageData>) => {
			update((messages) => {
				const message = messages.find((message) => message.id === messageId);
				if (!message) return messages;
				return [...messages, { ...message, ...data }];
			});
		},
		fetchMessages: async () => {
			const messages = await getMessages();
			set(messages);
		}
	};
};

export const MessageCache = createMessageStore();
