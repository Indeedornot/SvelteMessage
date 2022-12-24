import type { UserData } from '../../models';
import type {
	ChannelCTSEvents,
	ChannelSTCEvents,
	ChannelSTSEvents,
	MessageCTSEvents,
	MessageSTCEvents,
	UserCTSEvents,
	UserSTCEvents
} from './events';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents extends ChannelSTSEvents {}

export interface SocketData {
	user: UserData;
}

export interface ServerToClientEvents extends UserSTCEvents, MessageSTCEvents, ChannelSTCEvents {
	Connected: () => void; //Acknowledges a new connection
}

export interface ClientToServerEvents extends UserCTSEvents, MessageCTSEvents, ChannelCTSEvents {
	Connected: (user: UserData) => void; //Notifies of a new connection
}
