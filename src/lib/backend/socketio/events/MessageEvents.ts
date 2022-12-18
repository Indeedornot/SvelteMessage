import type { MessageApiData, MessageCreateApiData } from '../../../models';

export interface MessageSTCEvents {
	Message: (message: MessageApiData) => void; // Receive incoming messages and broadcast them
}

export interface MessageCTSEvents {
	Message: (message: MessageCreateApiData) => void; //Notifies of a new message to send
}
