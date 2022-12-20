import { UserScheme, UserUpdateScheme } from '../../../models';
import { prisma } from '../../prisma/prisma';
import type { typedServer, typedSocket } from '../socket-handler';

export const addUserListener = (io: typedServer, socket: typedSocket) => {
	socket.on('UserOffline', async () => {
		await makeOffline();
	});

	socket.on('disconnect', async () => {
		await makeOffline();
	});

	const makeOffline = async () => {
		// Remove the user from the list of connected users
		const user = socket.data.user;
		if (!user) return;

		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				online: false
			}
		});

		socket.broadcast.emit('UserOffline', user.id);
		socket.data.user = undefined;
	};

	socket.on('UserOnline', async (user) => {
		// Add the user to the list of connected users
		const parseData = UserScheme.safeParse(user);
		if (!parseData.success) {
			console.error('Invalid user data');
			return;
		}

		const userData = parseData.data;

		await prisma.user.update({
			where: {
				id: userData.id
			},
			data: {
				online: true
			}
		});

		socket.data.user = user;
		socket.broadcast.emit('UserOnline', userData.id);
	});

	socket.on('UserChanged', async (data) => {
		if (!socket.data.user) return;

		console.log('UserChanged', data);

		const parsedData = UserUpdateScheme.safeParse(data);
		if (!parsedData.success) {
			console.error('Invalid user data');
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

		socket.broadcast.emit('UserChanged', user.id, data);
		socket.emit('UserFinishedChanging', data);
	});
};
