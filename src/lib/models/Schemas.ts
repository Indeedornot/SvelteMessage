import type { Message, User } from '@prisma/client';

import { z } from 'zod';

import { MessageConstr, type MessageData, UserConstr, type UserData, UserStatus } from '.';

const idScheme = z.number().int().nonnegative();

const dateSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());

const statusSchema = z.nativeEnum(UserStatus);

const urlSchema = z.string().url();

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

export const MessageNewScheme = MessageScheme.omit({ id: true });

export const UserToData = (user: User): UserData => ({
	id: user.id,
	name: user.name,
	avatar: user.avatar,
	status: user.status as UserStatus
});

export const MessageToData = (message: Message & { sender: User }): MessageData => ({
	id: message.id,
	text: message.text,
	timestamp: message.timestamp,
	sender: UserToData(message.sender)
});
