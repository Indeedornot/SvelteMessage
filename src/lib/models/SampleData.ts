import { MessageData } from './MessageData';
import { UserData, UserStatus } from './UserData';

export const sampleUsers: { [Key: string]: UserData } = {
	john: new UserData({
		id: '1',
		name: 'John Doe',
		avatar: 'https://randomuser.me/api/portraits/men/21.jpg',
		status: UserStatus.Busy
	}),
	jane: new UserData({
		id: '2',
		name: 'Jane Doe',
		avatar: 'https://randomuser.me/api/portraits/women/39.jpg',
		status: UserStatus.Online
	})
};

export const sampleMessages: MessageData[] = [
	new MessageData({
		text: 'Hello, how are you?',
		id: 'messageId1',
		sender: sampleUsers.john,
		timestamp: 1670850397000
	}),
	new MessageData({
		text: 'I am fine, thank you!',
		id: 'messageId2',
		sender: sampleUsers.jane,
		timestamp: 1670853997000
	}),
	new MessageData({
		text: 'What about you?',
		id: 'messageId3',
		sender: sampleUsers.john,
		timestamp: 1670857597000
	}),
	new MessageData({
		text: 'I am fine too!',
		id: 'messageId4',
		sender: sampleUsers.jane,
		timestamp: 1670861197000
	}),
	new MessageData({
		text: 'Nice to hear that!',
		id: 'messageId5',
		sender: sampleUsers.john,
		timestamp: 1670864797000
	}),
	new MessageData({
		text: 'Bye!',
		id: 'messageId6',
		sender: sampleUsers.jane,
		timestamp: 1670868397000
	})
];
