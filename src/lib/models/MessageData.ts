import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export class MessageData {
	id: string;
	text: string;
	timestamp: number;
	sender: string;
	// receiver: string;
	// isRead: boolean;
	// isDeleted: boolean;
	// isEdited: boolean;
	// isPinned: boolean;

	constructor(id: string, text: string, timestamp: number, sender: string) {
		this.id = id;
		this.text = text;
		this.timestamp = timestamp;
		this.sender = sender;
	}

	timeAgo() {
		//use dayjs to calculate time ago
		return dayjs.unix(this.timestamp).fromNow();
	}
}

export const sampleMessages: MessageData[] = [
	new MessageData('1', 'Hello, how are you?', 1670850397, '1'),
	new MessageData('2', 'I am fine, thank you!', 1670853997, '2'),
	new MessageData('3', 'What about you?', 1670857597, '1'),
	new MessageData('4', 'I am fine too!', 1670861197, '2'),
	new MessageData('5', 'Nice to hear that!', 1670864797, '1'),
	new MessageData('6', 'Bye!', 1670868397, '1')
];
