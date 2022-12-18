import { getOnlineUsers, getUsers } from '$lib/helpers/socketio/User';
import type { UserData } from '$lib/models';
import { writable } from 'svelte/store';

import { updateUserRef } from './helpers';

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
				if (!user) return users;

				updateUserRef(user, data);
				return users;
			});
		},
		addOrUpdateUser: (updateData: UserData) => {
			update((users) => {
				const user = users.find((u) => u.id === updateData.id);
				if (!user) return [...users, updateData];
				updateUserRef(user, updateData);

				return users;
			});
		},
		fetchUsers: async () => {
			const users = await getUsers();
			set(users);
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

				updateUserRef(user, data);
				return users;
			}),
		fetchUsers: async () => {
			const users = await getOnlineUsers();
			set(users);
		}
	};
};

export const OnlineUsers = createOnlineUsersStore();
