export type UserData = {
	id: number;
	name: string;
	avatar: string;
	status: UserStatus;
};

export type UserUpdateData = Omit<Partial<UserData>, 'id'>;

export enum UserStatus {
	Online = 'online',
	Offline = 'offline',
	Busy = 'busy',
	Away = 'away'
}

export const UserStatusColors = {
	[UserStatus.Online]: 'online',
	[UserStatus.Offline]: 'offline',
	[UserStatus.Busy]: 'busy',
	[UserStatus.Away]: 'away'
};

export const UserStatusNames = {
	[UserStatus.Online]: 'Online',
	[UserStatus.Offline]: 'Offline',
	[UserStatus.Busy]: 'Busy',
	[UserStatus.Away]: 'Do not disturb'
};

export const getStatusColor = (status: UserStatus | undefined) => {
	return UserStatusColors[status ?? UserStatus.Offline];
};

export const getStatusName = (status: UserStatus | undefined) => {
	return UserStatusNames[status ?? UserStatus.Offline];
};

export const UserConstr = {
	name: { maxLength: 32, minLength: 1 }
};
