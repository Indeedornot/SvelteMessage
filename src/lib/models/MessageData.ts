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

export type MessageCreateApiData = Omit<MessageApiData, 'id'>;

export type MessageChangedData = Omit<MessageData, 'id' | 'sender' | 'timestamp'>;

export type MessageApiData = {
	id: number;
	text: string;
	timestamp: Date;
	senderId: number;
};

export const MessageConstr = {
	text: { maxLength: 256, minLength: 1 }
};
