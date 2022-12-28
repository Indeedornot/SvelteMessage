import { z } from 'zod';

import { dateSchema, idSchema } from '../Schemas';
import { UserSchema } from '../User';
import { MessageConstr } from './MessageData';

export const MessageTextScheme = z.string().min(MessageConstr.text.minLength).max(MessageConstr.text.maxLength);

export const SenderSchema = UserSchema.partial({ channelUser: true });

export const MessageScheme = z.object({
	id: idSchema,
	text: MessageTextScheme,
	sender: SenderSchema, //for left users
	createdAt: dateSchema,
	updatedAt: dateSchema
});

export const MessageApiScheme = MessageScheme.omit({ sender: true }).extend({
	senderId: idSchema
});

export const MessageCreateScheme = z.object({
	text: MessageTextScheme
});

export const MessageChangedScheme = z.object({
	text: MessageTextScheme
});

export const MessageUpdateScheme = MessageChangedScheme.extend({
	id: idSchema,
	updatedAt: dateSchema
});
