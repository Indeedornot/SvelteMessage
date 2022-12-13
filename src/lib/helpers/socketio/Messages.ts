import type { MessageData, MessageNewData, UserData } from '$lib/models';
import { io } from '$lib/socketio/socket-client';

import { getUserData, setUserData } from '../DataStore';

export const getMessages = () => {
	return new Promise<MessageData[]>((resolve) => {
		io.emit('MessagesHistory', 10);
		io.once('MessagesHistory', (data: MessageData[]) => {
			resolve(data);
		});
	});
};

export const addUserListener = (onOnline: (data: UserData) => void, onOffline: (userId: number) => void) => {
	io.on('UserOnline', (data: UserData) => {
		onOnline(data);
	});

	io.on('UserOffline', (userId: number) => {
		onOffline(userId);
	});
};

export const getName = (): Promise<UserData> => {
	return new Promise<UserData>((resolve) => {
		const userData = getUserData();
		console.log('userData', userData);

		if (userData) {
			resolve(userData);
			return;
		}

		io.emit('Name');
		io.once('Name', (newUser: UserData) => {
			setUserData(newUser);
			resolve(newUser);
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
