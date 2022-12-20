import { updateRef } from '$lib/helpers/jsUtils';
import { getSelfUser, updateUser } from '$lib/helpers/socketio/User';
import type { UserData, UserUpdateData } from '$lib/models';
import { get, writable } from 'svelte/store';

const createUserStore = () => {
	const { subscribe, set, update } = writable<UserData | null>(null);
	return {
		subscribe,
		set,
		update,
		setUser: (user: UserData) => set(user),
		updateUser: async (data: UserUpdateData) => {
			const userData = get(UserStore);
			if (!userData) return null;

			const updateData = await updateUser(data);
			update((user) => {
				if (!user) return null;

				//mutate user using data without deleting the reference
				updateRef(userData, updateData);

				return user;
			});
		},
		fetchUser: async () => {
			const UserData = await getSelfUser();

			set(UserData);
			return UserData;
		}
	};
};

export const UserStore = createUserStore();
