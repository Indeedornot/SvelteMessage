import { changeMessage, deleteMessage } from '$lib/helpers/backend/Messages';
import { updateRef } from '$lib/helpers/jsUtils';
import type { MessageChangedData, MessageData, MessageUpdateApiData } from '$lib/models';
import { get, writable } from 'svelte/store';

const createMessageStore = () => {
	const { subscribe, set: setInternal, update } = writable<MessageData[]>([]);

	//Since I use the reference to user on a MessageData,
	//i need to manually send notification from store
	const crud = {
		set: (messages: MessageData[]) => setInternal(messages),
		add: (message: MessageData) => update((messages) => [...messages, message]),
		remove: (messageId: number) => {
			update((messages) => {
				deleteMessage(messageId);
				return messages.filter((message) => message.id !== messageId);
			});
		},
		change: async (messageId: number, data: MessageChangedData) => {
			const message = get(MessageCache).find((message) => message.id === messageId);
			if (!message) return;

			const updateData = await changeMessage(messageId, data);

			update((messages) => {
				updateRef(message, updateData);
				return messages;
			});
		},
		update: (messageId: number, data: MessageUpdateApiData) => {
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
