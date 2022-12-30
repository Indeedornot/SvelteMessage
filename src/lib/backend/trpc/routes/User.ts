import { prisma } from '$lib/backend/prisma/prisma';
import { generateRandomAvatar } from '$lib/helpers/RandomAvatar';
import { type UserApiData, UserApiSchema, type UserData, UserSchema, UserStatus, idSchema } from '$lib/models';
import { z } from 'zod';

import { getUserById, getUsersByChannelId } from '../../prisma/helpers';
import { logger } from '../middleware/logger';
import { t } from '../t';

export const user = t.router({
	getById: t.procedure
		.use(logger)
		.input(
			z.object({
				id: z.number(),
				channelId: z.number()
			})
		)
		.query(async ({ input }) => {
			const user: UserData = await getUserById(input);
			return UserSchema.parse(user);
		}),
	getCurrUserById: t.procedure
		.use(logger)
		.input(idSchema)
		.query(async ({ input }) => {
			const user: UserApiData = await getUserById({ id: input });
			return UserApiSchema.parse(user);
		}),
	create: t.procedure.use(logger).query(async () => {
		const user = await prisma.user.create({
			data: {
				name: 'New User',
				avatar: generateRandomAvatar(),
				status: UserStatus.Online,
				currChannelId: undefined
			}
		});

		const returnData: UserApiData = {
			...user,
			status: user.status as never,
			channelUser: null,
			currChannelId: null
		};

		return UserApiSchema.parse(returnData);
	}),

	getAllByChannelId: t.procedure
		.use(logger)
		.input(idSchema)
		.query(async ({ input }) => {
			const returnData: UserData[] = await getUsersByChannelId(input);
			return z.array(UserSchema).parse(returnData);
		})
});
