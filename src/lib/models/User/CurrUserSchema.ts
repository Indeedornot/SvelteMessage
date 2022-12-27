import { z } from 'zod';

import { ChannelScheme } from '../Channel';
import { RoleScheme } from '../Role/RoleSchema';
import { idScheme } from '../Schemas';
import { BaseUserSchema } from './UserSchema';

export const CurrChannelSchema = z
	.object({
		id: idScheme,
		owner: z.boolean(),
		roles: z.array(RoleScheme)
	})
	.nullable();

export const CurrUserScheme = BaseUserSchema.extend({
	channels: z.array(ChannelScheme),
	currChannel: CurrChannelSchema,
	owned: z.array(idScheme)
});

export const UserSocketScheme = BaseUserSchema.extend({
	channels: z.array(idScheme),
	currChannel: CurrChannelSchema,
	owned: z.array(idScheme)
});
