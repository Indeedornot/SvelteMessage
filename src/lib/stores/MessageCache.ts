import { getMessages } from '$lib/helpers/socketio/Messages';
import { getOnlineUsers, getUser as getUserData } from '$lib/helpers/socketio/User';
import type { MessageData, UserData } from '$lib/models';
import { writable } from 'svelte/store';

const createUsersStore = () => {
	const { subscribe, set, update } = writable<UserData[]>([]);
	return {
		subscribe,
		set,
		update,
		addUser: (user: UserData) =>
			update((users) => {
				if (!users.find((u) => u.id === user.id)) return [...users, user];
				return users;
			}),
		removeUser: (userId: number) => update((users) => users.filter((user) => user.id !== userId)),
		updateUser: (userId: number, data: Partial<UserData>) => {
			update((users) => {
				const user = users.find((user) => user.id === userId);
				if (user) {
					return [...users, { ...user, ...data }];
				}
				return users;
			});
		}
	};
};

export const UsersCache = createUsersStore();

const createOnlineUsersStore = () => {
	const { subscribe, set, update } = writable<UserData[]>([]);
	return {
		subscribe,
		set,
		update,
		addUser: (user: UserData) => update((users) => [...users, user]),
		removeUser: (userId: number) => update((users) => users.filter((user) => user.id !== userId)),
		updateUser: (userId: number, data: Partial<UserData>) =>
			update((users) => {
				const user = users.find((user) => user.id === userId);

				if (!user) return users;
				return [...users, { ...user, ...data }];
			}),
		fetchUsers: async () => {
			const users = await getOnlineUsers();
			set(users);
		}
	};
};

export const OnlineUsers = createOnlineUsersStore();

const createUserStore = () => {
	const { subscribe, set, update } = writable<UserData | null>(null);
	return {
		subscribe,
		set,
		update,
		setUser: (user: UserData) => set(user),
		updateUser: (data: Partial<UserData>) => {
			update((user) => {
				if (!user) return null;
				return { ...user, ...data };
			});
		},
		fetchUser: async () => {
			const UserData = await getUserData();
			set(UserData);
			return UserData;
		}
	};
};

export const UserStore = createUserStore();

const createMessageStore = () => {
	const { subscribe, set, update } = writable<MessageData[]>([]);
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
