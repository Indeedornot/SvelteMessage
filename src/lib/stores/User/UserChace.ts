import { getUser, updateUser } from '$lib/helpers/socketio/User';
import type { UserData, UserUpdateData } from '$lib/models';
import { get, writable } from 'svelte/store';

import { updateUserRef } from './helpers';

const createUserStore = () => {
	const { subscribe, set, update } = writable<UserData | null>(null);
	return {
		subscribe,
		set,
		update,
		setUser: (user: UserData) => set(user),
		updateUser: (data: UserUpdateData) => {
			const before = get({ subscribe });
			update((user) => {
				if (!user) return null;
				updateUser(data);
				//mutate user using data without deleting the reference
				updateUserRef(user, data);

				return user;
			});
			const after = get({ subscribe });
			console.log('equals', before === after);
		},
		fetchUser: async () => {
			const UserData = await getUser();

			set(UserData);
			return UserData;
		}
	};
};

export const UserStore = createUserStore();
