import type { z } from 'zod';

import type { CurrChannelSchema, CurrUserScheme, UserSocketScheme } from './CurrUserSchema';
import type { BaseUserSchema, UserChangedScheme, UserScheme } from './UserSchema';

export type BaseUserData = z.infer<typeof BaseUserSchema>;

export type UserData = z.infer<typeof UserScheme>;

export type CurrChannelData = z.infer<typeof CurrChannelSchema>;

export type UserSocketData = z.infer<typeof UserSocketScheme>;

export type CurrUserData = z.infer<typeof CurrUserScheme>;

//without id and online since they are not updatable by the user
export type UserChangedData = z.infer<typeof UserChangedScheme>;

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
