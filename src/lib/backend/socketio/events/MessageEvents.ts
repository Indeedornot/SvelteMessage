import type { MessageData, MessageNewData } from '../../../models';

export interface MessageSTCEvents {
	MessagesHistory: (messages: MessageData[]) => void; //Sends previous messages to a new connected user
	Message: (message: MessageData) => void; // Receive incoming messages and broadcast them
}

export interface MessageCTSEvents {
	Message: (message: MessageNewData) => void; //Notifies of a new message to send
	MessagesHistory: (count: number) => void; //Requests X messages
}
