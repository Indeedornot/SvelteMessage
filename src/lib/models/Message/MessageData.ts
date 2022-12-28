import type { z } from 'zod';

import type {
	MessageApiScheme,
	MessageChangedScheme,
	MessageCreateScheme,
	MessageScheme,
	MessageUpdateScheme,
	SenderSchema
} from './MessageSchema';

//#: Channel stuff is handled inside socket itself

export type MessageData = z.infer<typeof MessageScheme>;

export type SenderData = z.infer<typeof SenderSchema>;

export type MessageApiData = z.infer<typeof MessageApiScheme>;

export type MessageCreateData = z.infer<typeof MessageCreateScheme>;

export type MessageChangedData = z.infer<typeof MessageChangedScheme>;

export type MessageUpdateData = z.infer<typeof MessageUpdateScheme>;

export const MessageConstr = {
	text: { maxLength: 256, minLength: 1 }
};

export const ApiToMsgData = (message: MessageApiData, user: SenderData): MessageData => {
	return {
		id: message.id,
		text: message.text,
		createdAt: message.createdAt,
		updatedAt: message.updatedAt,
		sender: user
	};
};
