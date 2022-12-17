import { io } from '$lib/backend/socketio/socket-client';
import type { MessageData, MessageNewData } from '$lib/models';

export const getMessages = () => {
	return new Promise<MessageData[]>((resolve) => {
		io.emit('MessagesHistory', 10);
		io.once('MessagesHistory', (data: MessageData[]) => {
			console.log('MessagesHistory', data);

			resolve(data);
		});
	});
};

export const addMessageListener = (callback: (message: MessageData) => void) => {
	io.on('Message', (message: MessageData) => {
		callback(message);
		// messages = [...messages, message];
	});
};

export const sendNewMessage = (message: MessageNewData) => {
	io.emit('Message', message);
};
