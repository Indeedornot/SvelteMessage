import type { ChannelData } from '../Channel';

export type BaseUserData = {
	id: number;
	name: string;
	avatar: string;
	status: UserStatus;
	online: boolean;
};

export type UserData = BaseUserData & {
	channels: number[];
};

export type UserSocketData = BaseUserData & {
	channels: number[];
	lastChannelId: number | null;
};

export type CurrUserData = BaseUserData & {
	channels: ChannelData[];
	lastChannelId: number | null;
};

//without id and online since they are not updatable by the user
export type UserChangedData = {
	name?: string;
	avatar?: string;
	status?: UserStatus;
};

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