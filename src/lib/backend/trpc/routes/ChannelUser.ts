import { getRolesByChannelId } from '$lib/backend/prisma/helpers';
import { prisma } from '$lib/backend/prisma/prisma';
import { type ChannelUserData, ChannelUserSchema, idSchema } from '$lib/models';

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
		})
});
