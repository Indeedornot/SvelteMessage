import { updateRef } from '$lib/helpers/jsUtils';
import type { MessageData, MessageUpdateData } from '$lib/models';
import { writable } from 'svelte/store';

const createMessageStore = () => {
	const { subscribe, set: setInternal, update } = writable<MessageData[]>([]);

	//Since I use the reference to user on a MessageData,
	//i need to manually send notification from store
	const crud = {
		set: (messages: MessageData[]) => setInternal(messages),
		add: (message: MessageData) => update((messages) => [...messages, message]),
		remove: (messageId: number) => {
			update((messages) => {
				return messages.filter((message) => message.id !== messageId);
			});
		},
		update: (messageId: number, data: MessageUpdateData) => {
			update((messages) => {
				console.log('Msg UPT', messageId, data);

				const message = messages.find((message) => message.id === messageId);
				if (!message) return messages;

				updateRef(message, data);
				return messages;
			});
		},
		clear: () => setInternal([]),
		causeUpdate: () => update((messages) => messages)
	};

	return {
		subscribe,
		crud
	};
};

export const MessageCache = createMessageStore();
