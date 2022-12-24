/*
export type ChannelData = {
	id: number;
	name: string;
	avatar: string;
	createdAt: Date;
	updatedAt: Date;
};

export type ChannelCreateApiData = {
	avatar?: string;
	name: string;
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

	messages: MessageData[];

	createdAt: Date;
	updatedAt: Date;
};

*/
import { z } from 'zod';

import { MessageApiScheme } from '../Message';
import { avatarSchema, dateSchema, idScheme } from '../Schemas';
import { UserScheme } from '../User';
import { ChannelConstr } from './ChannelData';

export const channelNameSchema = z.string().min(ChannelConstr.name.minLength).max(ChannelConstr.name.maxLength);

export const ChannelScheme = z.object({
	id: idScheme,
	name: channelNameSchema,
	avatar: avatarSchema,
	createdAt: dateSchema,
	updatedAt: dateSchema
});

export const ChannelApiScheme = ChannelScheme.extend({
	users: z.array(UserScheme),
	messages: z.array(MessageApiScheme)
});

export const ChannelCreateApiScheme = z.object({
	name: channelNameSchema,
	avatar: avatarSchema
});

export const ChannelChangedScheme = z
	.object({
		name: channelNameSchema,
		avatar: avatarSchema
	})
	.partial();

export const ChannelUpdateApiScheme = ChannelChangedScheme.extend({
	updatedAt: dateSchema
});
