import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { nanoid } from 'nanoid';
import { z } from 'zod';

dayjs.extend(relativeTime);

type MessageDataProps = {
	text: string;
	senderId: string;
	senderName: string;
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
	senderId: string;
	senderName: string;

	constructor({ text, senderId, senderName, timestamp, id }: MessageDataProps) {
		this.id = id ?? nanoid();
		this.text = text;
		this.timestamp = timestamp ?? Date.now();
		this.senderId = senderId;
		this.senderName = senderName;
	}
}

export const MessageScheme = z.object({
	id: z.string(),
	text: z.string(),
	timestamp: z.number(),
	senderId: z.string(),
	senderName: z.string()
});

export const sampleMessages: MessageData[] = [
	new MessageData({
		text: 'Hello, how are you?',
		id: 'messageId1',
		senderId: 'senderId1',
		senderName: 'senderName1',
		timestamp: 1670850397000
	}),
	new MessageData({
		text: 'I am fine, thank you!',
		id: 'messageId2',
		senderId: 'senderId2',
		senderName: 'senderName2',
		timestamp: 1670853997000
	}),
	new MessageData({
		text: 'What about you?',
		id: 'messageId3',
		senderId: 'senderId1',
		senderName: 'senderName1',
		timestamp: 1670857597000
	}),
	new MessageData({
		text: 'I am fine too!',
		id: 'messageId4',
		senderId: 'senderId2',
		senderName: 'senderName2',
		timestamp: 1670861197000
	}),
	new MessageData({
		text: 'Nice to hear that!',
		id: 'messageId5',
		senderId: 'senderId1',
		senderName: 'senderName1',
		timestamp: 1670864797000
	}),
	new MessageData({
		text: 'Bye!',
		id: 'messageId6',
		senderId: 'senderId1',
		senderName: 'senderName1',
		timestamp: 1670868397000
	})
];
