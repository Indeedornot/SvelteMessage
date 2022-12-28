export const socketUtil = {
	log: (...args: any[]) => {
		console.log('[socket] [ok]', ...args);
	},
	error: (...args: any[]) => {
		console.error('[socket] [err]', ...args);
	}
};

export const roomFromChannel = (channelId: number) => {
	return `Channel-${channelId}`;
};

export const roomFromUser = (userId: number) => {
	return `User-${userId}`;
};

export const roomsFromChannelsObj = (channels: { channel: { id: number } }[]) => {
	return channels.map((channel) => roomFromChannel(channel.channel.id));
};

export const roomsFromChannels = (channels: { id: number }[]) => {
	return channels.map((channel) => roomFromChannel(channel.id));
};

export const roomsFromUsers = (users: { id: number }[]) => {
	return users.map((user) => roomFromUser(user.id));
};
