import { getChannelById, getChannelUserByData } from '../../../../backend/prisma/helpers';
import {
	type ChannelChangedData,
	type ChannelUpdateApiData,
	ChannelUpdateSchema,
	type UserSocketData
} from '../../../../models';
import { getUsersByChannelId } from '../../../prisma/helpers';
import { prisma } from '../../../prisma/prisma';
import type { typedServer, typedSocket } from '../../socket-handler';
import { roomFromChannel, roomFromUser, socketUtil } from '../../socketUtils';

export const addChannelListener = (io: typedServer, socket: typedSocket) => {
	socket.on('ChannelChanged', async (data: ChannelChangedData) => {
		socketUtil.log('[ChannelChanged] Channel changed', data);
		const user = socket.data.user;
		if (!user) {
			socketUtil.error('[ChannelChanged] User not found');
			return;
		}

		const parsedData = ChannelUpdateSchema.safeParse(data);
		if (!parsedData.success) {
			socketUtil.error('[ChannelChanged] Invalid Update Data', parsedData.error);
			return;
		}

		const exists = await channelExists(data.id);
		if (!exists) {
			console.error('[ChannelChanged] Channel does not exist');
			return;
		}

		const channel = await prisma.channel.update({
			where: {
				id: data.id
			},
			data: { ...parsedData.data }
		});
		const users = await getUsersByChannelId(data.id);

		const returnData: ChannelUpdateApiData = {
			...data,
			updatedAt: channel.updatedAt
		};

		users.forEach((user) => {
			io.to(roomFromUser(user.id)).emit('ChannelChanged', returnData);
		});
		socket.emit('ChannelFinishedChanging', returnData);
	});

	socket.on('ChannelNewJoining', async (channelId: number) => {
		socketUtil.log('[ChannelNewJoining] Channel new joining', channelId);
		const user = socket.data.user;
		if (!user) {
			socketUtil.error('[ChannelNewJoining] User not found');
			socket.emit('ChannelNewFinishedJoining', null);
			return;
		}

		const exists = await channelExists(channelId);
		if (!exists) {
			socketUtil.error('[ChannelNewJoining] Channel does not exist');
			socket.emit('ChannelNewFinishedJoining', null);
			return;
		}

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
			last: user.channel?.id,
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
	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			currChannel: channelId ? { connect: { id: channelId } } : { disconnect: true }
		}
	});

	if (!channelId) {
		user.channel = null;
		user.channelUser = null;
		return;
	}

	const currChannel = await getChannelById(channelId);
	const currChannelUser = await getChannelUserByData(user.id, channelId);

	if (!currChannel || !currChannelUser) {
		throw new Error('[socket] [updateLastChannel] Channel data not found');
	}

	user.channel = currChannel;
	user.channelUser = currChannelUser;
};

const leaveChannel = async (socket: typedSocket, user: UserSocketData, channelId: number) => {
	if (user.channel?.id === channelId) {
		updateLastChannel(user, null);
	}

	await prisma.channelUser.delete({
		where: {
			channelId_userId: {
				channelId: channelId,
				userId: user.id
			}
		}
	});

	user.channels = user.channels.filter((channel) => channel !== channelId);

	socket.broadcast.to(roomFromChannel(channelId)).emit('ChannelLeft', user.id);
	socket.emit('ChannelFinishedLeaving', true);
	socket.leave(roomFromChannel(channelId));

	socketUtil.log('[leaveChannel] Left channel', channelId, socket.rooms);
};

const joinNewChannel = async (socket: typedSocket, user: UserSocketData, channelId: number) => {
	const { id } = await prisma.channelUser.create({
		data: {
			channel: {
				connect: {
					id: channelId
				}
			},
			user: {
				connect: {
					id: user.id
				}
			}
		}
	});

	user.channels.push(id);

	socket.emit('ChannelNewFinishedJoining', id);
	socket.broadcast.to(roomFromChannel(channelId)).emit('ChannelNewJoined', user.id);
	socketUtil.log('[joinChannel] Joined channel', channelId, socket.rooms);
};

const switchChannel = async (socket: typedSocket, user: UserSocketData, channelId: number) => {
	if (user.channel) {
		socket.leave(roomFromChannel(user.channel.id));
	}

	updateLastChannel(user, channelId);
	socket.join(roomFromChannel(channelId));
};
