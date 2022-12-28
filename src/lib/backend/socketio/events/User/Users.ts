import { UserChangedSchema, UserSocketSchema } from '../../../../models';
import { prisma } from '../../../prisma/prisma';
import type { typedServer, typedSocket } from '../../socket-handler';
import { roomsFromChannels, socketUtil } from '../../socketUtils';

export const addUserListener = (io: typedServer, socket: typedSocket) => {
	socket.on('UserOffline', async () => {
		socketUtil.log('[UserOffline] User disconnected');
		await makeOffline();
	});

	socket.on('disconnect', async () => {
		socketUtil.log('[disconnect] User disconnected');
		await makeOffline();
	});

	const makeOffline = async () => {
		// Remove the user from the list of connected users
		const user = socket.data.user;
		if (!user) return;

		await prisma.user.update({
			where: { id: user.id },
			data: { online: false }
		});

		socket.broadcast.to(roomsFromChannels(user.channels)).emit('UserOffline', user.id);
		socket.data.user = undefined;
	};

	socket.on('UserOnline', async (user) => {
		socketUtil.log('[UserOnline]');
		// Add the user to the list of connected users
		const parseData = UserSocketSchema.safeParse(user);
		if (!parseData.success) {
			socketUtil.error('[UserOnline] Invalid user data');
			return;
		}

		const userData = parseData.data;
		await prisma.user.update({
			where: { id: userData.id },
			data: { online: true }
		});

		socket.data.user = user;
		socket.broadcast.to(roomsFromChannels(user.channels)).emit('UserOnline', userData.id);
	});

	socket.on('UserChanged', async (data) => {
		socketUtil.log('[UserChanged] UserChanged', data);
		if (!socket.data.user) {
			socketUtil.log('[UserChanged] No user');
			return;
		}
		const parsedData = UserChangedSchema.safeParse(data);
		if (!parsedData.success) {
			socketUtil.error('[UserChanged] Invalid user data');
			return;
		}

		const user = (socket.data.user = {
			...socket.data.user,
			...parsedData.data
		});

		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				...parsedData.data
			}
		});

		socket.broadcast.to(roomsFromChannels(user.channels)).emit('UserChanged', user.id, data);
		socket.emit('UserFinishedChanging', data);
	});
};
