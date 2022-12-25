import type { MessageApiData, MessageData } from '../Message';
import type { UserData } from '../User';

export type ChannelData = {
	id: number;
	name: string;
	avatar: string;
	createdAt: Date;
	updatedAt: Date;
	ownerId: number;
};

export type ChannelCreateApiData = {
	avatar: string;
	name: string;
	creatorId: number;
};

export type ChannelChangedData = {
	avatar?: string;
	name?: string;
};

export type ChannelUpdateApiData = {
	name?: string;
	avatar?: string;
	updatedAt: Date;
};

export type ChannelApiData = {
	id: number;
	name: string;
	avatar: string;

	users: UserData[];

	messages: MessageApiData[];

	ownerId: number;

	createdAt: Date;
	updatedAt: Date;
};

export const ChannelConstr = {
	name: { maxLength: 50, minLength: 1 }
};
