import {
	type ChannelChangedData,
	type ChannelUpdateApiData,
	ChannelUpdateApiScheme,
	type UserData,
	type UserSocketData
} from '../../../../models';
import { prisma } from '../../../prisma/prisma';
import type { typedServer, typedSocket } from '../../socket-handler';
import { roomFromChannel, roomFromUser, socketUtil } from '../../socketUtils';

export const addChannelListener = (io: typedServer, socket: typedSocket) => {
	socket.on('ChannelChanged', async (channelId: number, data: ChannelChangedData) => {
		socketUtil.log('[ChannelChanged] Channel changed', channelId, data);
		const user = socket.data.user;
		if (!user) {
			socketUtil.error('[ChannelChanged] User not found');
			return;
		}

		const parsedData = ChannelUpdateApiScheme.safeParse(data);
		if (!parsedData.success) {
			socketUtil.error('[ChannelChanged] Invalid Update Data', parsedData.error);
			return;
		}

		const exists = await channelExists(channelId);
		if (!exists) {
			console.error('[ChannelChanged] Channel does not exist');
			return;
		}

		const channel = await prisma.channel.update({
			where: {
				id: channelId
			},
			data: { ...parsedData.data },
			include: {
				users: {
					select: {
						id: true
					},
					where: {
						id: { not: user.id },
						online: true
					}
				}
			}
		});

		const returnData: ChannelUpdateApiData = {
			...data,
			updatedAt: channel.updatedAt
		};

		channel.users.forEach((user) => {
			io.to(roomFromUser(user.id)).emit('ChannelChanged', channelId, returnData);
		});
		socket.emit('ChannelFinishedChanging', returnData);
	});

	socket.on('ChannelNewJoining', async (channelId: number) => {
		socketUtil.log('[ChannelNewJoining] Channel new joining', channelId);
		const user = socket.data.user;
		if (!user) {
			socketUtil.error('[ChannelNewJoining] User not found');
			socket.emit('ChannelNewFinishedJoining', false);
			return;
		}

		const exists = await channelExists(channelId);
		if (!exists) {
			socketUtil.error('[ChannelNewJoining] Channel does not exist');
			socket.emit('ChannelNewFinishedJoining', false);
			return;
		}

		socket.emit('ChannelNewFinishedJoining', true);
		joinNewChannel(socket, user, channelId);
	});

	socket.on('ChannelLeft', (channelId: number) => {
		socketUtil.log('[ChannelLeft] Channel left', channelId);
		const user = socket.data.user;
		if (!user) {
			socketUtil.error('[ChannelLeft] User not found');
			socket.emit('ChannelFinishedLeaving', false);
			return;
		}

		leaveChannel(socket, user, channelId);
		socket.emit('ChannelFinishedLeaving', true);
	});

	io.on('ChannelRemoved', async (channelId: number) => {
		socketUtil.log('[ChannelRemoved] Channel removed', channelId);
		const user = socket.data.user;
		if (!user) {
			socketUtil.error('[ChannelRemoved] User not found');
			return;
		}

		socket.broadcast.to(roomFromChannel(channelId)).emit('ChannelRemoved', channelId);
		socket.emit('ChannelRemoved', channelId);

		leaveChannel(socket, user, channelId);
	});

	socket.on('ChannelSwitch', async (channelId: number) => {
		socketUtil.log('[ChannelSwitch] Channel switch', channelId);
		const user = socket.data.user;
		if (!user) {
			socketUtil.error('[ChannelSwitch] User not found');
			socket.emit('ChannelFinishedSwitching', false);
			return;
		}

		const exists = await channelExists(channelId);
		if (!exists) {
			socketUtil.error('[ChannelSwitch] Channel does not exist');
			socket.emit('ChannelFinishedSwitching', false);
			return;
		}

		socketUtil.log('[ChannelSwitch] Switching channel', {
			id: channelId,
			last: user.lastChannelId,
			rooms: socket.rooms
		});
		switchChannel(socket, user, channelId);
		socket.emit('ChannelFinishedSwitching', true);
	});
};

const channelExists = async (id: number) => {
	return (await prisma.channel.count({ where: { id } })) !== 0;
};

const updateLastChannel = async (user: UserSocketData, channelId: number | null) => {
	user.lastChannelId = channelId;
	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			lastChannelId: channelId
		}
	});
};

const leaveChannel = async (socket: typedSocket, user: UserSocketData, channelId: number) => {
	if (user.lastChannelId === channelId) {
		updateLastChannel(user, null);
	}
	user.channels = user.channels.filter((channel) => channel !== channelId);
	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			channels: {
				disconnect: {
					id: channelId
				}
			}
		}
	});

	socket.broadcast.to(roomFromChannel(channelId)).emit('ChannelLeft', user.id);
	socket.leave(roomFromChannel(channelId));

	socketUtil.log('[leaveChannel] Left channel', channelId, socket.rooms);
};

const joinNewChannel = async (socket: typedSocket, user: UserData, channelId: number) => {
	user.channels.push(channelId);
	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			channels: {
				connect: {
					id: channelId
				}
			}
		}
	});

	socket.broadcast.to(roomFromChannel(channelId)).emit('ChannelNewJoined', user.id);
	socketUtil.log('[joinChannel] Joined channel', channelId, socket.rooms);
};

const switchChannel = async (socket: typedSocket, user: UserSocketData, channelId: number) => {
	if (user.lastChannelId !== null) {
		socket.leave(roomFromChannel(user.lastChannelId));
	}

	updateLastChannel(user, channelId);
	socket.join(roomFromChannel(channelId));
};