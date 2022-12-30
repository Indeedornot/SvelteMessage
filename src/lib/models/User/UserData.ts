import type { z } from 'zod';

import type {
	ChannelSocketSchema,
	ChannelUserSocketSchema,
	RoleSocketSchema,
	UserSocketSchema
} from './CurrUserSchema';
import type { ChannelUserSchema, UserApiSchema, UserChangedSchema, UserSchema } from './UserSchema';

export type ChannelUserData = z.infer<typeof ChannelUserSchema> | null;

export type UserData = z.infer<typeof UserSchema>;

//without id and online since they are not updatable by the user
export type UserChangedData = z.infer<typeof UserChangedSchema>;

export enum UserStatus {
	Online = 'online',
	Invisible = 'invisible',
	Busy = 'busy',
	Away = 'away'
}

export const UserStatusColors = {
	[UserStatus.Online]: 'online',
	[UserStatus.Invisible]: 'offline',
	[UserStatus.Busy]: 'busy',
	[UserStatus.Away]: 'away'
};

export const UserStatusNames = {
	[UserStatus.Online]: 'Online',
	[UserStatus.Invisible]: 'Invisible',
	[UserStatus.Busy]: 'Busy',
	[UserStatus.Away]: 'Do not disturb'
};

export const getStatusColor = (status: UserStatus | undefined) => {
	return UserStatusColors[status ?? UserStatus.Invisible];
};

export const getStatusName = (status: UserStatus | undefined) => {
	return UserStatusNames[status ?? UserStatus.Invisible];
};

export const UserConstr = {
	name: { maxLength: 32, minLength: 1 }
};

export type RoleSocketData = z.infer<typeof RoleSocketSchema>;

export type ChannelSocketData = z.infer<typeof ChannelSocketSchema>;

export type ChannelUserSocketData = z.infer<typeof ChannelUserSocketSchema>;

export type UserSocketData = z.infer<typeof UserSocketSchema>;

export type UserApiData = z.infer<typeof UserApiSchema>;
