import { UserScheme, UserStatus, UserToData } from '../../../models';
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
				status: UserStatus.Offline
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
				status: UserStatus.Online
			}
		});

		socket.data.user = user;
		socket.broadcast.emit('UserOnline', userData);
	});

	socket.on('UsersOnline', async () => {
		// Send the list of connected users to the new user
		const users = await prisma.user.findMany({
			where: {
				status: UserStatus.Online
			}
		});

		console.log('UsersOnline', users);

		socket.emit('UsersOnline', users.map(UserToData));
	});

	socket.on('UserChanged', async (data) => {
		if (!socket.data.user) return;
		if (Object.keys(data).length === 0) return;

		const parsedData = UserScheme.partial().safeParse(data);
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

		io.emit('UserChanged', user.id, data);
	});
};
