//Needs to use relative imports due to being processed in vite.config.js
import { Server, Socket } from 'socket.io';

import { UserScheme, UserStatus, UserToData } from '../models';
import { prisma } from '../prisma/prisma';
import { addMessageListener, addUserListener } from './Events';
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './socket-events';

export type typedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type typedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function injectSocketIO(server: any) {
	const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server.httpServer);

	// Socket.IO stuff goes here
	io.on('connection', (socket: typedSocket) => {
		console.log('SocketIO connected');

		socket.on('Name', async () => {
			// Generate a random username and send it to the client to display it

			const user = await prisma.user.create({
				data: {
					name: 'New User',
					avatar: `https://icotar.com/avatar/${Math.random().toString(36).substring(7)}`,
					status: UserStatus.Offline
				}
			});

			const userData = UserToData(user);

			socket.emit('Name', userData);
		});

		socket.on('Connected', async (user) => {
			// Save the user data
			const userData = UserScheme.safeParse(user);
			if (!userData.success) {
				console.error('Invalid user data', userData.error);
				return;
			}

			const exists = await prisma.user.findUnique({
				where: {
					id: userData.data.id
				}
			});
			if (!exists) {
				console.error('User does not exist');
				return;
			}

			await prisma.user.update({
				where: {
					id: userData.data.id
				},
				data: {
					status: UserStatus.Online
				}
			});

			socket.data.user = user;
			socket.broadcast.emit('UserOnline', user);
		});

		addUserListener(io, socket);
		addMessageListener(io, socket);

		socket.on('disconnect', async () => {
			//If user didn't send offline event
			if (socket.data.user !== undefined) {
				await prisma.user.update({
					where: {
						id: socket.data.user.id
					},
					data: {
						status: UserStatus.Offline
					}
				});

				socket.broadcast.emit('UserOffline', socket.data.user.id);
			}
		});
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
