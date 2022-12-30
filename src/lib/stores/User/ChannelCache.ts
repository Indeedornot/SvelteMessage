import type { ChannelData, ChannelUpdateApiData } from '$lib/models';
import { writable } from 'svelte/store';

const createChannelsStore = () => {
	const { subscribe, set: setInternal, update } = writable<ChannelData[]>([]);
	const crud = {
		set: async (channels: ChannelData[]) => {
			setInternal(channels);
		},
		add: async (newChannel: ChannelData) => {
			update((channels) => {
				if (channels.find((channel) => channel.id === newChannel.id)) return channels;

				return [...channels, newChannel];
			});
		},
		update: async (updateChannel: ChannelUpdateApiData) => {
			update((channels) => {
				const index = channels.findIndex((channel) => channel.id === updateChannel.id);
				if (index === -1) return channels;

				channels[index] = { ...channels[index], ...updateChannel };
				return channels;
			});
		},
		remove: async (channelId: number) => {
			update((channels) => {
				return channels.filter((channel) => channel.id !== channelId);
			});
		}
	};

	return {
		subscribe,
		crud
	};
};

export const ChannelsCache = createChannelsStore();

export const createChannelStore = () => {
	const { subscribe, set: setInternal } = writable<ChannelData | null>(null);

	const crud = {
		set: (channel: ChannelData | null) => {
			setInternal(channel);
		}
	};

	return {
		subscribe,
		crud
	};
};

export const ChannelStore = createChannelStore();
