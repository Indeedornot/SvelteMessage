type UserDataProps = {
	id: string;
	name?: string;
	avatar?: string;
	status?: UserStatus;
	//channels: ChannelData[];
};

export class UserData {
	id: string;
	name: string;
	avatar: string;
	status: UserStatus;

	constructor({ id, name, avatar, status }: UserDataProps) {
		this.id = id;
		const nameValue = name ?? id;
		this.name = nameValue;
		this.avatar = avatar ?? `https://icotar.com/avatar/${nameValue}`;
		this.status = status ?? UserStatus.Offline;
	}
}

export enum UserStatus {
	Online = 'online',
	Offline = 'offline',
	Busy = 'busy',
	Away = 'away'
}
