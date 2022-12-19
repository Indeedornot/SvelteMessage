import type { UserData, UserUpdateData } from '../../../models';

export interface UserSTCEvents {
	UserOnline: (userId: number) => void; //Notifies of a user going online (saves data)
	UserOffline: (userId: number) => void; //Notifies of a user going offline (data is already stored in clients)
	UserChanged: (userId: number, data: UserUpdateData) => void; //Notifies of a user changing their name
}

export interface UserCTSEvents {
	UserOnline: (data: UserData) => void; //Notifies of a client going online (saves data)
	UserOffline: () => void; //Notifies of a user going offline (server has the data stored already)
	UserChanged: (data: UserUpdateData) => void; //Sends a name change to the server
}
