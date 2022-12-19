import { getUserById, getUsers } from '$lib/helpers/socketio/User';
import type { UserData, UserUpdateData } from '$lib/models';
import { derived, get, writable } from 'svelte/store';

import { UserStore } from './UserChace';
import { updateUserRef } from './helpers';

const createUsersStore = () => {
	const { subscribe, set, update } = writable<UserData[]>([]);

	const crud = {
		add: (user: UserData) => {
			update((users) => {
				if (!users.find((u) => u.id === user.id)) return [...users, user];
				return users;
			});
		},
		remove: (userId: number) => {
			update((users) => users.filter((user) => user.id !== userId));
		},
		update: (userId: number, data: UserUpdateData) => {
			update((users) => {
				const user = users.find((user) => user.id === userId);
				if (!user) return users;

				updateUserRef(user, data);
				return users;
			});
		},
		addOrUpdate: (updateData: UserData) => {
			update((users) => {
				const user = users.find((u) => u.id === updateData.id);
				if (!user) return [...users, updateData];
				updateUserRef(user, updateData);

				return users;
			});
		}
	};

	const status = {
		setOffline: (userId: number) => {
			update((users) => {
				const user = users.find((user) => user.id === userId);
				if (!user) return users;

				user.online = false;

				return users;
			});
		},

		setOnline: async (userId: number) => {
			const user = get(UsersCache).find((user) => user.id === userId);
			if (!user) {
				await fetch.user(userId);
				return;
			}

			update((users) => {
				user.online = true;
				return users;
			});
		}
	};

	const fetch = {
		users: async () => {
			const users = await getUsers();
			const currentUser = get(UserStore);
			if (!currentUser) {
				set(users);
				return;
			}

			set(users.filter((user) => user.id !== currentUser.id));
		},
		user: async (userId: number) => {
			const user = get(UsersCache).find((user) => user.id === userId);
			if (!user) {
				await getUserById(userId).then((fetchedUser) => {
					if (fetchedUser)
						update((users) => {
							return [...users, fetchedUser];
						});
				});
			}
		}
	};

	return {
		subscribe,
		set,
		update,
		crud,
		status,
		fetch
	};
};

export const UsersCache = createUsersStore();

export const createOnlineUsersStore = () => {
	const { subscribe } = derived(UsersCache, ($users) => {
		console.table($users);
		const online: UserData[] = [];
		const offline: UserData[] = [];

		$users.forEach((user) => {
			if (user.online) online.push(user);
			else offline.push(user);
		});

		return { online, offline };
	});

	return {
		subscribe
	};
};

export const OnlineUsersStore = createOnlineUsersStore();
