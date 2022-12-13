import { z } from 'zod';

import { UserStatus } from './UserData';

export const UserScheme = z.object({
	id: z.string(),
	name: z.string(),
	avatar: z.string(),
	status: z.nativeEnum(UserStatus)
});

export const MessageScheme = z.object({
	id: z.string(),
	text: z.string(),
	timestamp: z.number(),
	sender: UserScheme
});
