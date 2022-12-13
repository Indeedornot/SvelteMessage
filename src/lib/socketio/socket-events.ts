import type { MessageData } from '../models/MessageData';
import type { UserData } from '../models/UserData';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {}

export interface ServerToClientEvents {
	Message: (message: MessageData) => void; // Receive incoming messages and broadcast them
	Name: (id: string) => void; //Sends new name to client
	UserOnline: (user: UserData) => void; //Notifies of a user going online (saves data)
	UserOffline: (userId: string) => void; //Notifies of a user going offline (data is already stored in clients)
	UsersOnline: (users: UserData[]) => void; //Sends to a new connected user all online users
}

export interface ClientToServerEvents {
	Message: (message: MessageData) => void; //Notifies of a new message to send
	Name: () => void; //Requests new user data
	UserOnline: (user: UserData) => void; //Notifies of a client going online (saves data)
	UserOffline: () => void; //Notifies of a user going offline (server has the data stored already)
	UsersOnline: () => void; //Sends to a new connected user all online users
	Connected: (user: UserData) => void; //Notifies of a new connection
}

export interface SocketData {
	user: UserData;
}
