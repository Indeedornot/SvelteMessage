import type { z } from 'zod';

import type { BaseUserData, UserData } from '../User/';
import type {
	MessageApiScheme,
	MessageChangedScheme,
	MessageCreateApiScheme,
	MessageScheme,
	MessageUpdateApiScheme
} from './MessageSchema';

//#: Channel stuff is handled inside socket itself

export type MessageData = z.infer<typeof MessageScheme>;

export type MessageApiData = z.infer<typeof MessageApiScheme>;

export type MessageCreateApiData = z.infer<typeof MessageCreateApiScheme>;

export type MessageChangedData = z.infer<typeof MessageChangedScheme>;

export type MessageUpdateApiData = z.infer<typeof MessageUpdateApiScheme>;

export const MessageConstr = {
	text: { maxLength: 256, minLength: 1 }
};

export const ApiToMsgData = (message: MessageApiData, user: BaseUserData): MessageData => {
	return {
		id: message.id,
		text: message.text,
		createdAt: message.createdAt,
		updatedAt: message.updatedAt,
		sender: user
	};
};
