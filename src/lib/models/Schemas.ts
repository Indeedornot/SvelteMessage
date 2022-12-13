import type { Message, User } from '@prisma/client';

import { z } from 'zod';

import { type MessageData, type UserData, UserStatus } from '.';

const idScheme = z.number().int().nonnegative();

const dateSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());

export const UserScheme = z.object({
	id: idScheme,
	name: z.string(),
	avatar: z.string(),
	status: z.nativeEnum(UserStatus)
});

export const MessageScheme = z.object({
	id: idScheme,
	text: z.string().min(1),
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
