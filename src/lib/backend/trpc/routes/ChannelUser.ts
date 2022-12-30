import { getRolesByChannelId, getRolesByChannelUserId } from '$lib/backend/prisma/helpers';
import { prisma } from '$lib/backend/prisma/prisma';
import { type ChannelUserData, ChannelUserSchema, idSchema } from '$lib/models';
import { z } from 'zod';

import { logger } from '../middleware/logger';
import { t } from '../t';

export const channelUser = t.router({
	getById: t.procedure
		.use(logger)
		.input(idSchema)
		.query(async ({ input }) => {
			const channelUser = await prisma.channelUser.findUniqueOrThrow({
				where: {
					id: input
				}
			});
			const roles = await getRolesByChannelId(input);

			const returnData: ChannelUserData = {
				...channelUser,
				roles: roles
			};

			return ChannelUserSchema.parse(returnData);
		}),
	getByData: t.procedure
		.use(logger)
		.input(
			z.object({
				userId: idSchema,
				channelId: idSchema
			})
		)
		.query(async ({ input }) => {
			const channelUser = await prisma.channelUser.findUniqueOrThrow({
				where: {
					channelId_userId: {
						channelId: input.channelId,
						userId: input.userId
					}
				}
			});
			const roles = await getRolesByChannelUserId(channelUser.id);

			const returnData: ChannelUserData = {
				...channelUser,
				roles: roles
			};

			return ChannelUserSchema.parse(returnData);
		})
});
