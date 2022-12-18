import type { UserData } from './UserData';

export type MessageData = {
	// receiver: string;
	// isRead: boolean;
	// isDeleted: boolean;
	// isEdited: boolean;
	// isPinned: boolean;

	id: number;
	text: string;
	timestamp: Date;
	sender: UserData;
};

export type MessageCreateApiData = {
	text: string;
	timestamp: Date;
	senderId: number;
};

export type MessageApiData = {
	id: number;
	text: string;
	timestamp: Date;
	senderId: number;
};

export const MessageConstr = {
	text: { maxLength: 256, minLength: 1 }
};
