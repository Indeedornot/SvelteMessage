import type { MessageData } from './MessageData';
import { type UserData, UserStatus } from './UserData';

export const sampleUsers: { [Key: string]: UserData } = {
	john: {
		id: 1,
		name: 'John Doe',
		avatar: 'https://randomuser.me/api/portraits/men/21.jpg',
		status: UserStatus.Busy
	},
	jane: {
		id: 2,
		name: 'Jane Doe',
		avatar: 'https://randomuser.me/api/portraits/women/39.jpg',
		status: UserStatus.Online
	}
};

export const sampleMessages: MessageData[] = [
	{
		text: 'Hello, how are you?',
		id: 1,
		sender: sampleUsers.john,
		timestamp: new Date(1670850397000)
	},
	{
		text: 'I am fine, thank you!',
		id: 2,
		sender: sampleUsers.jane,
		timestamp: new Date(1670853997000)
	},
	{
		text: 'What about you?',
		id: 3,
		sender: sampleUsers.john,
		timestamp: new Date(1670857597000)
	},
	{
		text: 'I am fine too!',
		id: 4,
		sender: sampleUsers.jane,
		timestamp: new Date(1670861197000)
	},
	{
		text: 'Nice to hear that!',
		id: 5,
		sender: sampleUsers.john,
		timestamp: new Date(1670864797000)
	},
	{
		text: 'Bye!',
		id: 6,
		sender: sampleUsers.jane,
		timestamp: new Date(1670868397000)
	}
];
