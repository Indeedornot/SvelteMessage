import { getChannelById } from '../../../../backend/prisma/helpers';
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
	socket.on('ChannelChanged', async (channelId: number, data: ChannelChangedData) => {
		socketUtil.log('[ChannelChanged] Channel changed', channelId, data);
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

		const exists = await channelExists(channelId);
		if (!exists) {
			console.error('[ChannelChanged] Channel does not exist');
			return;
		}

		const channel = await prisma.channel.update({
			where: {
				id: channelId
			},
			data: { ...parsedData.data }
		});
		const users = await getUsersByChannelId(channelId);

		const returnData: ChannelUpdateApiData = {
			...data,
			updatedAt: channel.updatedAt
		};

		users.forEach((user) => {
			io.to(roomFromUser(user.id)).emit('ChannelChanged', channelId, returnData);
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
			last: user.currData?.channel.id,
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
		user.currData = null;
		return;
	}

	const currChannel = user.channels.find((channel) => channel.id === channelId);
	const currChannelUser = user.channelUsers.find((channelUser) => channelUser.channelId === channelId);

	if (!currChannel || !currChannelUser) {
		throw new Error('[socket] [updateLastChannel] Channel data not found');
	}

	user.currData = {
		channel: currChannel,
		channelUser: currChannelUser
	};
};

const leaveChannel = async (socket: typedSocket, user: UserSocketData, channelId: number) => {
	if (user.currData?.channel.id === channelId) {
		updateLastChannel(user, null);
	}

	user.channels = user.channels.filter((channel) => channel.id !== channelId);
	await prisma.channelUser.delete({
		where: {
			channelId_userId: {
				channelId: channelId,
				userId: user.id
			}
		}
	});

	socket.broadcast.to(roomFromChannel(channelId)).emit('ChannelLeft', user.id);
	socket.emit('ChannelFinishedLeaving', true);
	socket.leave(roomFromChannel(channelId));

	socketUtil.log('[leaveChannel] Left channel', channelId, socket.rooms);
};

const joinNewChannel = async (socket: typedSocket, user: UserSocketData, channelId: number) => {
	const channel = await getChannelById(channelId);
	user.channels.push({
		id: channel.id,
		roles: channel.roles
	});

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

	user.channelUsers.push({
		channelId: channelId,
		roles: channel.roles,
		id: id
	});

	socket.emit('ChannelNewFinishedJoining', id);
	socket.broadcast.to(roomFromChannel(channelId)).emit('ChannelNewJoined', user.id);
	socketUtil.log('[joinChannel] Joined channel', channelId, socket.rooms);
};

const switchChannel = async (socket: typedSocket, user: UserSocketData, channelId: number) => {
	if (user.currData) {
		socket.leave(roomFromChannel(user.currData.channel.id));
	}

	updateLastChannel(user, channelId);
	socket.join(roomFromChannel(channelId));
};
