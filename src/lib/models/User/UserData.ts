import type { ChannelData } from '../Channel';
import type { RoleData } from '../Role/RoleData';

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

export type CurrChannelData = {
	id: number;
	owner: boolean;
	roles: RoleData[];
} | null;

export type UserSocketData = BaseUserData & {
	channels: number[];
	currChannel: CurrChannelData;
	owned: number[];
};

export type CurrUserData = BaseUserData & {
	channels: ChannelData[];
	currChannel: CurrChannelData;
	owned: number[];
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
