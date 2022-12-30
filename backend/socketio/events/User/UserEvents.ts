import type { UserChangedData, UserSocketData } from '../../../imports/models';

export interface UserSTCEvents {
	UserOnline: (userId: number) => void; //Notifies of a user going online (saves data)
	UserOffline: (userId: number) => void; //Notifies of a user going offline (data is already stored in clients)
	UserChanged: (userId: number, data: UserChangedData) => void; //Notifies of a user changing their name
	UserFinishedChanging: (data: UserChangedData) => void; //Notifies of a user changing their name
}

export interface UserCTSEvents {
	UserOnline: (data: UserSocketData) => void; //Notifies of a client going online (saves data)
	UserOffline: () => void; //Notifies of a user going offline (server has the data stored already)
	UserChanged: (data: UserChangedData) => void; //Sends a name change to the server
}
