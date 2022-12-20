import type { UserData } from './UserData';

export type MessageData = {
	// receiver: string;
	// isRead: boolean;
	// isDeleted: boolean;
	// isEdited: boolean;
	// isPinned: boolean;

	id: number;
	text: string;
	sender: UserData;
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

export type MessageApiData = {
	id: number;
	text: string;
	senderId: number;
	createdAt: Date;
	updatedAt: Date;
};

export const MessageConstr = {
	text: { maxLength: 256, minLength: 1 }
};
