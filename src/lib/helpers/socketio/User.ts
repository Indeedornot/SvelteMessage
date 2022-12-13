import type { UserData } from '$lib/models';
import { io } from '$lib/socketio/socket-client';

export const getOnlineUsers = (): Promise<UserData[]> => {
	return new Promise<UserData[]>((resolve) => {
		io.emit('UsersOnline');
		io.once('UsersOnline', (data: UserData[]) => {
			resolve(data);
		});
	});
};

export const goOnline = (user: UserData): Promise<void> => {
	return new Promise<void>((resolve) => {
		io.emit('Connected', user);
		io.once('Connected', () => {
			resolve();
		});
	});
};
