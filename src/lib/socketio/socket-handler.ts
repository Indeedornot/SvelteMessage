import { nanoid } from 'nanoid';
import { Server } from 'socket.io';

import { MessageScheme } from '../models/MessageData';
import { events } from './socket-events';

export function injectSocketIO(server) {
	const io = new Server(server.httpServer);

	// Socket.IO stuff goes here
	io.on(events.CONNECTION, (socket) => {
		console.log('SocketIO connected');

		socket.on(events.NAME, () => {
			// Generate a random username and send it to the client to display it
			const userId = nanoid();
			socket.emit(events.NAME, userId);
		});

		// Receive incoming messages and broadcast them
		socket.on(events.MESSAGE, (message) => {
			const parseData = MessageScheme.safeParse(message);
			if (!parseData.success) {
				console.error('Invalid message received', parseData.error);
				return;
			}

			console.log('Message received', parseData.data);

			const messageData = parseData.data;
			io.emit(events.MESSAGE, messageData);
		});
	});

	console.log('SocketIO injected');
}
