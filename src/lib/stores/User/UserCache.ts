import { updateRef } from '$lib/helpers/jsUtils';
import type { ChannelUserData, UserChangedData, UserData } from '$lib/models';
import { writable } from 'svelte/store';

import { MessageCache } from '../MessageCache';

const createUserStore = () => {
	const { subscribe, set: setInternal, update } = writable<UserData | null>();

	const crud = {
		set: async (user: UserData) => {
			setInternal(user);
		},
		update: async (data: UserChangedData) => {
			update((user) => {
				if (!user) return null;

				//mutate user using data without deleting the reference
				updateRef(user, data);
				return user;
			});

			MessageCache.crud.causeUpdate();
		},
		channelUser: {
			set: async (channelUser: ChannelUserData) => {
				update((user) => {
					if (!user) return null;

					user.channelUser = channelUser;
					return user;
				});
			}
		}
	};

	return {
		subscribe,
		crud
	};
};

export const UserStore = createUserStore();
