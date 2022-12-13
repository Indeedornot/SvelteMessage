import { nanoid } from 'nanoid';
import { Server } from 'socket.io';

import { MessageScheme } from '../models/MessageData';
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from './socket-events';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function injectSocketIO(server: any) {
	const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(server.httpServer);

	// Socket.IO stuff goes here
	io.on('connection', (socket) => {
		console.log('SocketIO connected');

		socket.on('NAME', () => {
			// Generate a random username and send it to the client to display it
			const userId = nanoid();
			socket.emit('NAME', userId);
		});

		// Receive incoming messages and broadcast them
		socket.on('MESSAGE', (message) => {
			const parseData = MessageScheme.safeParse(message);
			if (!parseData.success) {
				console.error('Invalid message received', parseData.error);
				return;
			}

			console.log('Message received', parseData.data);

			const messageData = parseData.data;
			io.emit('MESSAGE', messageData);
		});
	});

	console.log('SocketIO injected');
}
