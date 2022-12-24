import { z } from 'zod';

import { avatarSchema, idScheme } from '../Schemas';
import { UserConstr, UserStatus } from '../User/UserData';

export const statusSchema = z.nativeEnum(UserStatus);

export const userNameSchema = z.string().min(UserConstr.name.minLength).max(UserConstr.name.maxLength);

export const BaseUserSchema = z.object({
	id: idScheme,
	name: userNameSchema,
	avatar: avatarSchema,
	status: statusSchema,
	online: z.boolean()
});

export const UserScheme = BaseUserSchema.extend({
	channels: z.array(idScheme)
});

export const UserChangedScheme = BaseUserSchema.omit({ online: true, id: true }).partial();
