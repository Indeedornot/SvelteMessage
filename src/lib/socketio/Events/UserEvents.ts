import type { UserData } from '../../models';

export interface UserSTCEvents {
	UserOnline: (user: UserData) => void; //Notifies of a user going online (saves data)
	UserOffline: (userId: number) => void; //Notifies of a user going offline (data is already stored in clients)
	UsersOnline: (users: UserData[]) => void; //Sends to a new connected user all online users
	UserNameChanged: (userId: number, name: string) => void; //Notifies of a user changing their name
}

export interface UserCTSEvents {
	UserOnline: (user: UserData) => void; //Notifies of a client going online (saves data)
	UserOffline: () => void; //Notifies of a user going offline (server has the data stored already)
	UsersOnline: () => void; //Sends to a new connected user all online users
	UserNameChanged: (name: string) => void; //Sends a name change to the server
}
