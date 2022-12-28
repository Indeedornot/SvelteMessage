import type { MessageApiData, MessageChangedData, MessageCreateData, MessageUpdateData } from '../../../../models';

export interface MessageSTCEvents {
	Message: (message: MessageApiData) => void; // Receive incoming messages and broadcast them
	MessageChanged: (messageId: number, message: MessageUpdateData) => void; // Receive incoming messages and broadcast them
	MessageDeleted: (messageId: number) => void; // Receive incoming messages and broadcast them
	MessageFinishedChanging: (message: MessageUpdateData) => void; // Receive incoming messages and broadcast them
}

export interface MessageCTSEvents {
	Message: (message: MessageCreateData) => void; //Notifies of a new message to send
	MessageChanged: (messageId: number, message: MessageChangedData) => void; //Notifies of a new message to send
	MessageDeleted: (messageId: number) => void; //Notifies of a new message to send
}
