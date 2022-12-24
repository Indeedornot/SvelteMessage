import { z } from 'zod';

import { avatarSchema, idScheme } from '../Schemas';
import { UserConstr, UserStatus } from '../User';

export const statusSchema = z.nativeEnum(UserStatus);

export const userNameSchema = z.string().min(UserConstr.name.minLength).max(UserConstr.name.maxLength);

export const UserScheme = z.object({
	id: idScheme,
	name: userNameSchema,
	avatar: avatarSchema,
	status: statusSchema,
	online: z.boolean(),
	channels: z.array(idScheme),
	lastChannelId: idScheme.nullable()
});

export const UserChangedScheme = UserScheme.omit({ online: true, id: true, channels: true }).partial();
