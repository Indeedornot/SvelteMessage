import { z } from 'zod';

import { MessageApiScheme } from '../Message';
import { RoleSchema } from '../Role/RoleSchema';
import { avatarSchema, dateSchema, idSchema } from '../Schemas';
import { UserSchema } from '../User';
import { ChannelConstr } from './ChannelData';

const channelNameSchema = z.string().min(ChannelConstr.name.minLength).max(ChannelConstr.name.maxLength);

export const ChannelSchema = z.object({
	id: idSchema,
	name: channelNameSchema,
	avatar: avatarSchema,
	roles: z.array(RoleSchema),

	createdAt: dateSchema,
	updatedAt: dateSchema
});

export const ChannelApiSchema = ChannelSchema.extend({
	users: z.array(UserSchema),
	messages: z.array(MessageApiScheme)
});

export const ChannelCreateSchema = z.object({
	name: channelNameSchema,
	avatar: avatarSchema,
	creatorId: idSchema
});

export const ChannelChangedSchema = z.object({
	id: idSchema,
	name: channelNameSchema.optional(),
	avatar: avatarSchema.optional()
});

export const ChannelUpdateSchema = ChannelChangedSchema.extend({
	updatedAt: dateSchema
});
