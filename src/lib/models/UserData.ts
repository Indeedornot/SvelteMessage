export type UserData = {
	id: number;
	name: string;
	avatar: string;
	status: UserStatus;
};

export enum UserStatus {
	Online = 'online',
	Offline = 'offline',
	Busy = 'busy',
	Away = 'away'
}

export const UserConstr = {
	name: { maxLength: 32, minLength: 1 }
};
