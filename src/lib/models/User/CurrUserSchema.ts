import { z } from 'zod';

import { ChannelScheme } from '../Channel';
import { idScheme } from '../Schemas';
import { BaseUserSchema } from './UserSchema';

export const CurrUserScheme = BaseUserSchema.extend({
	channels: z.array(ChannelScheme),
	lastChannelId: idScheme.nullable()
});

export const UserSocketScheme = BaseUserSchema.extend({
	channels: z.array(idScheme),
	lastChannelId: idScheme.nullable()
});
