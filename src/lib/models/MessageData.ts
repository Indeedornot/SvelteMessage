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

export type MessageNewData = {
	text: string;
	timestamp: Date;
	sender: UserData;
};
