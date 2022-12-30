import { z } from 'zod';

import { idSchema } from '../Schemas';

export const RoleSocketSchema = z.object({
	id: idSchema
});

export const ChannelSocketSchema = z.object({
	id: idSchema,
	roles: z.array(RoleSocketSchema)
});

export const ChannelUserSocketSchema = z.object({
	id: idSchema,
	roles: z.array(RoleSocketSchema)
});

export const UserSocketSchema = z.object({
	id: idSchema,
	channels: z.array(idSchema),
	channel: ChannelSocketSchema.nullable(),
	channelUser: ChannelUserSocketSchema.nullable()
});
