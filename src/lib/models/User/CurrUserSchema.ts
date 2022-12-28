import { z } from 'zod';

import { ChannelSchema } from '../Channel';
import { RoleSocketSchema } from '../Role/RoleSchema';
import { avatarSchema, idSchema } from '../Schemas';
import { ChannelUserSchema, UserNameSchema, statusSchema } from './UserSchema';

export const CurrDataSchema = z
	.object({
		channel: ChannelSchema, //ref
		channelUser: ChannelUserSchema //ref
	})
	.nullable();

export const CurrUserSchema = z.object({
	id: idSchema,
	name: UserNameSchema,
	avatar: avatarSchema,
	status: statusSchema,
	online: z.boolean(),
	channels: z.array(ChannelSchema),
	channelUsers: z.array(ChannelUserSchema),
	currData: CurrDataSchema
});

export const CurrUserApiSchema = CurrUserSchema.omit({ currData: true }).extend({
	currChannelId: idSchema.nullable()
});

const ChannelSocketSchema = z.object({
	id: idSchema,
	roles: z.array(RoleSocketSchema)
});

const ChannelUserSocketSchema = z.object({
	id: idSchema,
	channelId: idSchema,
	roles: z.array(RoleSocketSchema)
});

export const UserSocketSchema = z.object({
	id: idSchema,
	channels: z.array(ChannelSocketSchema),
	currData: z
		.object({
			channel: ChannelSocketSchema,
			channelUser: ChannelUserSocketSchema
		})
		.nullable(),
	channelUsers: z.array(ChannelUserSocketSchema)
});
