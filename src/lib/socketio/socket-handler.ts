//Needs to use relative imports due to being processed in vite.config.js
import { nanoid } from 'nanoid';
import { Server } from 'socket.io';

import { MessageData } from '../models/MessageData';
import { MessageScheme, UserScheme } from '../models/Schemas';
import { UserData } from '../models/UserData';
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './socket-events';

const connectedUsers = new Set<UserData>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function injectSocketIO(server: any) {
	const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server.httpServer);

	// Socket.IO stuff goes here
	io.on('connection', (socket) => {
		console.log('SocketIO connected');

		socket.on('Name', () => {
			// Generate a random username and send it to the client to display it
			const userId = nanoid();
			socket.emit('Name', userId);
			socket.data.user = new UserData({ id: userId });
		});

		socket.on('Connected', (user) => {
			// Save the user data
			const userData = UserScheme.safeParse(user);
			if (!userData.success) {
				console.error('Invalid user data', userData.error);
				return;
			}
			socket.data.user = user;
			connectedUsers.add(user);
			socket.broadcast.emit('UserOnline', user);
		});

		socket.on('UserOnline', (user) => {
			// Add the user to the list of connected users
			const parseData = UserScheme.safeParse(user);
			if (!parseData.success) {
				console.error('Invalid user data');
				return;
			}

			const userData = parseData.data;
			connectedUsers.add(new UserData({ ...userData }));
			socket.broadcast.emit('UserOnline', userData);
		});

		socket.on('UsersOnline', () => {
			// Send the list of connected users to the new user
			socket.emit('UsersOnline', [...connectedUsers]);
		});

		socket.on('UserOffline', () => {
			// Remove the user from the list of connected users
			const user = socket.data.user;
			if (!user) {
				console.error('User not found');
				return;
			}

			connectedUsers.delete(user);
			socket.broadcast.emit('UserOffline', user.id);
		});

		// Receive incoming messages and broadcast them
		socket.on('Message', (message) => {
			const parseData = MessageScheme.safeParse(message);
			if (!parseData.success) {
				console.error('Invalid message received', parseData.error);
				return;
			}

			console.log('Message received', parseData.data);

			const messageData = new MessageData({ ...parseData.data });
			socket.broadcast.emit('Message', messageData);
		});

		socket.on('disconnect', () => {
			//If user didn't send offline event
			const user = socket.data.user;
			if (user) {
				connectedUsers.delete(user);
				io.emit('UserOffline', user.id);
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
