import { fetchChannelByIdWithData, getChannelById, joinNewChannel, switchChannel } from '$lib/helpers/backend/Channels';
import { getSelfUser, updateUser, userToCurrUser } from '$lib/helpers/backend/User';
import { browserUtils, updateRef } from '$lib/helpers/jsUtils';
import type { ChannelUpdateApiData, CurrUserData, UserChangedData } from '$lib/models';
import { get, writable } from 'svelte/store';

import { MessageCache } from '../MessageCache';
import { LeftUsersStore, UsersCache } from './UsersCache';

const createUserStore = () => {
	const { subscribe, set: setInternal, update } = writable<CurrUserData | null>();

	const crud = {
		set: async (user: CurrUserData) => {
			//initial room joining is handled by socketio

			setInternal(user);
			if (!user) {
				return;
			}

			//set last channel
			if (user.lastChannelId) {
				crud.lastChannelId.set(user.lastChannelId);
			}
		},
		update: async (data: UserChangedData) => {
			const userData = get(UserStore);
			if (!userData) return null;

			const updateData = await updateUser(data);
			update((user) => {
				if (!user) return null;

				//mutate user using data without deleting the reference
				updateRef(userData, updateData);

				return user;
			});

			MessageCache.crud.causeUpdate();
		},
		channels: {
			add: async (channelId: number) => {
				const channel = get(UserStore)?.channels.find((channel) => channel.id === channelId);
				if (channel) return false;

				const newChannel = await getChannelById(channelId);
				browserUtils.log('addChannel', newChannel);
				if (!newChannel) return false;

				await joinNewChannel(channelId);

				update((user) => {
					if (!user) return null;

					user.channels = [...user.channels, newChannel];
					return user;
				});

				browserUtils.log('addedChannel', newChannel);
				return true;
			},
			remove: (channelId: number) => {
				update((user) => {
					if (!user) return null;

					user.channels = user.channels.filter((channel) => channel.id !== channelId);
					if (channelId === user.lastChannelId) {
						user.lastChannelId = null;
						UsersCache.crud.clear();
						LeftUsersStore.crud.clear();
						MessageCache.crud.clear();
					}

					return user;
				});
			},
			update: (channelId: number, data: ChannelUpdateApiData) => {
				update((user) => {
					if (!user) return user;

					const channel = user.channels.find((channel) => channel.id === channelId);
					if (!channel) return user;

					updateRef(channel, data);
					return user;
				});
			}
		},
		lastChannelId: {
			update: async (channelId: number) => {
				//handles a null check
				await switchChannel(channelId);
				const channel = await fetchChannelByIdWithData(channelId);
				console.log('last channel id updated', channel);

				if (!channel) return;

				LeftUsersStore.crud.set(channel.left);
				UsersCache.crud.set(channel.users);
				MessageCache.crud.set(channel.messages);

				update((user) => {
					if (!user) return null;

					user.lastChannelId = channel ? channelId : user.lastChannelId;
					return user;
				});

				console.log('last channel id updated');
			},
			set: async (channelId: number) => {
				const channel = await fetchChannelByIdWithData(channelId);
				if (!channel) return;

				LeftUsersStore.crud.set(channel.left);
				UsersCache.crud.set(channel.users);
				MessageCache.crud.set(channel.messages);
			}
		}
	};

	return {
		subscribe,
		crud,
		fetch: async () => {
			const UserData = await getSelfUser();
			const currUserData: CurrUserData = await userToCurrUser(UserData);
			crud.set(currUserData);
			return UserData;
		}
	};
};

export const UserStore = createUserStore();
