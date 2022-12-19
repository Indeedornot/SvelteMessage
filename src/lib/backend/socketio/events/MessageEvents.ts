import type { MessageApiData, MessageChangedData, MessageCreateApiData } from '../../../models';

export interface MessageSTCEvents {
	Message: (message: MessageApiData) => void; // Receive incoming messages and broadcast them
	MessageChanged: (messageId: number, message: MessageChangedData) => void; // Receive incoming messages and broadcast them
	MessageDeleted: (messageId: number) => void; // Receive incoming messages and broadcast them
}

export interface MessageCTSEvents {
	Message: (message: MessageCreateApiData) => void; //Notifies of a new message to send
	MessageChanged: (messageId: number, message: MessageChangedData) => void; //Notifies of a new message to send
	MessageDeleted: (messageId: number) => void; //Notifies of a new message to send
}
