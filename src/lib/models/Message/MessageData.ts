import type { BaseUserData, UserData } from '../User/';

//#: Channel stuff is handled inside socket itself

export type MessageData = {
	// receiver: string;
	// isRead: boolean;
	// isDeleted: boolean;
	// isEdited: boolean;
	// isPinned: boolean;

	id: number;
	text: string;
	sender: BaseUserData;
	createdAt: Date;
	updatedAt: Date;
};

export type MessageApiData = {
	id: number;
	text: string;
	senderId: number;
	createdAt: Date;
	updatedAt: Date;
};

export type MessageCreateApiData = {
	text: string;
};

export type MessageChangedData = {
	text: string;
};

export type MessageUpdateApiData = {
	text: string;
	updatedAt: Date;
};

export const MessageConstr = {
	text: { maxLength: 256, minLength: 1 }
};

export const ApiToMsgData = (message: MessageApiData, user: BaseUserData): MessageData => {
	return {
		id: message.id,
		text: message.text,
		createdAt: message.createdAt,
		updatedAt: message.updatedAt,
		sender: user
	};
};
