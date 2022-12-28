import type { z } from 'zod';

import type {
	ChannelApiSchema,
	ChannelChangedSchema,
	ChannelCreateSchema,
	ChannelSchema,
	ChannelUpdateSchema
} from './ChannelSchema';

export type ChannelData = z.infer<typeof ChannelSchema>;

export type ChannelCreateData = z.infer<typeof ChannelCreateSchema>;

export type ChannelChangedData = z.infer<typeof ChannelChangedSchema>;

export type ChannelUpdateApiData = z.infer<typeof ChannelUpdateSchema>;

export type ChannelApiData = z.infer<typeof ChannelApiSchema>;

export const ChannelConstr = {
	name: { maxLength: 50, minLength: 1 }
};
