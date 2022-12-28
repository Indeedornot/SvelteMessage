import { prisma } from '$lib/backend/prisma/prisma';
import { generateRandomAvatar } from '$lib/helpers/RandomAvatar';
import { type CurrUserApiData, CurrUserApiSchema, type UserData, UserSchema, UserStatus, idSchema } from '$lib/models';
import { z } from 'zod';

import { getChannelUsersByUserId, getChannelsByUserId, getUserById, getUsersByChannelId } from '../../prisma/helpers';
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
			const user = await getUserById(input);
			const returnData: UserData = { ...user };

			return UserSchema.parse(returnData);
		}),
	getByIdWithData: t.procedure
		.use(logger)
		.input(idSchema)
		.query(async ({ input }) => {
			const user = await prisma.user.findUniqueOrThrow({
				where: {
					id: input
				}
			});

			const channels = await getChannelsByUserId(user.id);
			const channelUsers = await getChannelUsersByUserId(user.id);

			const returnData: CurrUserApiData = {
				...user,
				status: user.status as never,
				channels: channels,
				channelUsers: channelUsers
			};

			return CurrUserApiSchema.parse(returnData);
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

		const returnData: CurrUserApiData = {
			...user,
			status: user.status as never,
			channels: [],
			channelUsers: []
		};

		return CurrUserApiSchema.parse(returnData);
	}),
	getAllByChannelId: t.procedure
		.use(logger)
		.input(idSchema)
		.query(async ({ input }) => {
			const returnData: UserData[] = await getUsersByChannelId(input);
			return z.array(CurrUserApiSchema).parse(returnData);
		})
});
