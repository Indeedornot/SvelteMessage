import { z } from 'zod';

import { dateSchema, idScheme } from '../Schemas';
import { BaseUserSchema } from '../User/UserSchema';
import { MessageConstr } from './MessageData';

export const messageTextScheme = z.string().min(MessageConstr.text.minLength).max(MessageConstr.text.maxLength);

export const MessageScheme = z.object({
	id: idScheme,
	text: messageTextScheme,
	sender: BaseUserSchema,
	createdAt: dateSchema,
	updatedAt: dateSchema
});

export const MessageApiScheme = MessageScheme.omit({ sender: true }).extend({
	senderId: idScheme
});

export const MessageCreateApiScheme = z.object({
	text: messageTextScheme
});

export const MessageChangedScheme = z.object({
	text: messageTextScheme
});

export const MessageUpdateApiScheme = MessageChangedScheme.extend({
	id: idScheme,
	updatedAt: dateSchema
});
