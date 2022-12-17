import type { UserData } from '../../models';
import type { MessageCTSEvents, MessageSTCEvents } from './events/MessageEvents';
import type { UserCTSEvents, UserSTCEvents } from './events/UserEvents';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {}

export interface SocketData {
	user: UserData;
}

export interface ServerToClientEvents extends UserSTCEvents, MessageSTCEvents {
	Name: (user: UserData) => void; //Sends new name to client
	Connected: () => void; //Acknowledges a new connection
}

export interface ClientToServerEvents extends UserCTSEvents, MessageCTSEvents {
	Name: () => void; //Requests new user data
	Connected: (user: UserData) => void; //Notifies of a new connection
}
