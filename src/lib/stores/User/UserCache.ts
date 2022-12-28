import { getSelfUser } from '$lib/helpers/backend/User';
import { browserUtils, updateRef } from '$lib/helpers/jsUtils';
import type {
	ChannelData,
	ChannelUpdateApiData,
	ChannelUserData,
	CurrData,
	CurrUserData,
	UserChangedData
} from '$lib/models';
import { writable } from 'svelte/store';

import { MessageCache } from '../MessageCache';

const createUserStore = () => {
	const { subscribe, set: setInternal, update } = writable<CurrUserData | null>();

	const crud = {
		set: async (user: CurrUserData) => {
			setInternal(user);
			if (!user) {
				return;
			}
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
		channels: {
			add: async (channelData: ChannelData) => {
				update((user) => {
					if (!user) return null;

					if (!user.channels.find((channel) => channel.id === channelData.id)) {
						user.channels = [...user.channels, channelData];
					}
					return user;
				});

				browserUtils.log('addedChannel', channelData);
				return true;
			},
			remove: async (channelId: number) => {
				update((user) => {
					if (!user) return null;
					user.channels = user.channels.filter((channel) => channel.id !== channelId);
					return user;
				});
			},
			update: (channelId: number, data: ChannelUpdateApiData) => {
				update((user) => {
					if (!user) return null;

					const channel = user.channels.find((channel) => channel.id === channelId);
					if (!channel) return user;

					updateRef(channel, data);
					return user;
				});
			}
		},
		currData: {
			set: async (currData: CurrData) => {
				update((user) => {
					if (!user) return null;

					user.currData = currData;
					return user;
				});
			}
		},
		channelUsers: {
			add: async (channelUser: ChannelUserData) => {
				update((user) => {
					if (!user) return null;

					user.channelUsers = [...user.channelUsers, channelUser];
					return user;
				});

				return true;
			},
			remove: (channelId: number) => {
				update((user) => {
					if (!user) return null;

					user.channelUsers = user.channelUsers.filter((channelUser) => channelUser.channelId !== channelId);
					return user;
				});
			}
		}
	};

	return {
		subscribe,
		crud,
		fetch: async () => {
			const currUserData: CurrUserData = await getSelfUser();
			crud.set(currUserData);
			return currUserData;
		}
	};
};

export const UserStore = createUserStore();
