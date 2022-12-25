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
	updatedAt: dateSchema,
	ownerId: idScheme
});

export const ChannelApiScheme = ChannelScheme.extend({
	users: z.array(UserScheme),
	messages: z.array(MessageApiScheme)
});

export const ChannelCreateApiScheme = z.object({
	name: channelNameSchema,
	avatar: avatarSchema,
	creatorId: idScheme
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
