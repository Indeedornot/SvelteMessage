import type { ChannelChangedData, ChannelUpdateApiData } from '../../../imports/models';

export interface ChannelSTCEvents {
	ChannelFinishedSwitching: (success: boolean) => void; //acknowledges a channel join

	ChannelNewJoined: (userId: number) => void; //sends message about new user joining
	ChannelNewFinishedJoining: (channelUserId: number | null) => void; //acknowledges a channel join

	ChannelChanged: (data: ChannelUpdateApiData) => void; //acknowledges a channel join
	ChannelFinishedChanging: (data: ChannelUpdateApiData) => void; //acknowledges a channel join

	ChannelLeft: (userId: number) => void; //sends message about user leaving
	ChannelFinishedLeaving: (success: boolean) => void; //acknowledges a channel join

	ChannelRemoved: (channelId: number) => void;
}

export interface ChannelCTSEvents {
	ChannelSwitch: (channelId: number) => void; //Event with acknowledgement

	ChannelNewJoining: (channelId: number) => void; //Event with acknowledgement

	ChannelChanged: (data: ChannelChangedData) => void; //Event with acknowledgement

	ChannelLeft: (channelId: number) => void; //Event with acknowledgement

	ChannelRemoved: (channelId: number) => void;
}

export interface ChannelSTSEvents {
	ChannelRemoved: (channelId: number) => void;
}
