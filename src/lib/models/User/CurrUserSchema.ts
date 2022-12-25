import { z } from 'zod';

import { ChannelScheme } from '../Channel';
import { idScheme } from '../Schemas';
import { BaseUserSchema } from './UserSchema';

const currChanelSchema = z
	.object({
		id: idScheme,
		owner: z.boolean()
	})
	.nullable();

export const CurrUserScheme = BaseUserSchema.extend({
	channels: z.array(ChannelScheme),
	currChannel: currChanelSchema,
	owned: z.array(idScheme)
});

export const UserSocketScheme = BaseUserSchema.extend({
	channels: z.array(idScheme),
	currChannel: currChanelSchema,
	owned: z.array(idScheme)
});
