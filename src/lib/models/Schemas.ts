import { z } from 'zod';

import { MessageConstr } from './MessageData';
import { UserConstr, UserStatus } from './UserData';

export const idScheme = z.number().int().nonnegative();

export const dateSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());

export const statusSchema = z.nativeEnum(UserStatus);

const urlSchema = z.string().url();
export const avatarSchema = urlSchema;

export const UserScheme = z.object({
	id: idScheme,
	name: z.string().min(UserConstr.name.minLength).max(UserConstr.name.maxLength),
	avatar: urlSchema,
	status: statusSchema
});

export const MessageScheme = z.object({
	id: idScheme,
	text: z.string().min(MessageConstr.text.minLength).max(MessageConstr.text.maxLength),
	timestamp: dateSchema,
	sender: UserScheme
});

export const MessageApiScheme = MessageScheme.omit({ sender: true }).extend({
	senderId: idScheme
});

export const MessageCreateApiScheme = MessageApiScheme.omit({ id: true });
