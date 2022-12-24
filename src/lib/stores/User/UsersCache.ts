import { getUserById } from '$lib/helpers/backend/User';
import { updateRef } from '$lib/helpers/jsUtils';
import type { UserChangedData, UserData } from '$lib/models';
import { derived, get, writable } from 'svelte/store';

import { MessageCache } from '../MessageCache';

const createLeftUsersStore = () => {
	const { subscribe, set: setInternal, update } = writable<UserData[]>([]);

	const crud = {
		remove: (userId: number) => update((users) => users.filter((user) => user.id !== userId)),
		set: (users: UserData[]) => setInternal(users),
		clear: () => setInternal([])
	};

	return {
		subscribe,
		crud
	};
};

export const LeftUsersStore = createLeftUsersStore();

const createUsersStore = () => {
	const { subscribe, set: setInternal, update } = writable<UserData[]>([]);

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
		update: (userId: number, data: UserChangedData) => {
			update((users) => {
				const user = users.find((user) => user.id === userId);
				if (!user) return users;

				updateRef(user, data);
				return users;
			});

			MessageCache.crud.causeUpdate();
		},
		addOrUpdate: (updateData: UserData) => {
			update((users) => {
				const user = users.find((u) => u.id === updateData.id);
				if (!user) return [...users, updateData];
				updateRef(user, updateData);
				MessageCache.crud.causeUpdate();

				return users;
			});
		},
		set: (users: UserData[]) => setInternal(users),
		clear: () => setInternal([])
	};

	const status = {
		setOffline: (userId: number) => {
			update((users) => {
				const user = users.find((user) => user.id === userId);
				if (!user) return users;

				user.online = false;

				return users;
			});

			MessageCache.crud.causeUpdate();
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

			MessageCache.crud.causeUpdate();
		}
	};

	const fetch = {
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
		crud,
		status,
		fetch
	};
};

export const UsersCache = createUsersStore();

export const createOnlineUsersStore = () => {
	const { subscribe } = derived(UsersCache, ($users) => {
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
