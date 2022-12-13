import { nanoid } from 'nanoid';

import type { UserData } from './UserData';

type MessageDataProps = {
	text: string;
	sender: UserData;
	timestamp?: number;
	id?: string;
};

export class MessageData {
	// receiver: string;
	// isRead: boolean;
	// isDeleted: boolean;
	// isEdited: boolean;
	// isPinned: boolean;

	id: string;
	text: string;
	timestamp: number;
	sender: UserData;

	constructor({ text, sender, timestamp, id }: MessageDataProps) {
		this.id = id ?? nanoid();
		this.text = text;
		this.timestamp = timestamp ?? Date.now();
		this.sender = sender;
	}
}
