//Needs to use relative imports due to being processed in vite.config.js
import { Server, Socket } from 'socket.io';

import { UserScheme, UserStatus } from '../../models';
import { prisma } from '../prisma/prisma';
import { addMessageListener, addUserListener } from './events';
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './socket-events';

export type typedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type typedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function injectSocketIO(server: any) {
	const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server.httpServer);

	await prisma.user.updateMany({
		where: {
			status: UserStatus.Online
		},
		data: {
			status: UserStatus.Offline
		}
	});

	// Socket.IO stuff goes here
	io.on('connection', async (socket: typedSocket) => {
		socket.on('Connected', async (user) => {
			// Save the user data
			console.log('Connected', user);

			const parseData = UserScheme.safeParse(user);
			if (!parseData.success) {
				console.error('Invalid user data', parseData.error);
				return;
			}

			const userData = parseData.data;
			const exists = await prisma.user.findUnique({
				where: {
					id: userData.id
				}
			});
			if (!exists) {
				console.error('User does not exist');
				return;
			}

			await prisma.user.update({
				where: {
					id: userData.id
				},
				data: {
					status: UserStatus.Online
				}
			});

			socket.data.user = user;
			socket.emit('Connected');
			socket.broadcast.emit('UserOnline', user);
		});

		addUserListener(io, socket);
		addMessageListener(io, socket);
	});

	console.log('SocketIO injected');
}

/* EMIT CHEATSHEET
// sending to sender-client only
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
socket.broadcast.to(socketid).emit('message', 'for your eyes only');

// list socketid
for (var socketid in io.sockets.sockets) {}
 OR
Object.keys(io.sockets.sockets).forEach((socketid) => {});
*/
