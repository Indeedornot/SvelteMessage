import { z } from 'zod';

import { RoleSchema } from '../Role/RoleSchema';
import { avatarSchema, idSchema } from '../Schemas';
import { UserConstr, UserStatus } from '../User/UserData';

export const statusSchema = z.nativeEnum(UserStatus);

export const UserNameSchema = z.string().min(UserConstr.name.minLength).max(UserConstr.name.maxLength);

export const ChannelUserSchema = z.object({
	id: idSchema,
	channelId: idSchema,
	roles: z.array(RoleSchema),
	createdAt: z.date()
});

export const UserSchema = z.object({
	id: idSchema,
	name: UserNameSchema,
	avatar: avatarSchema,
	status: statusSchema,
	online: z.boolean(),
	createdAt: z.date(),
	channelUser: ChannelUserSchema.nullable()
});

export const UserChangedSchema = UserSchema.omit({ online: true, id: true, roles: true, channelUser: true }).partial();
