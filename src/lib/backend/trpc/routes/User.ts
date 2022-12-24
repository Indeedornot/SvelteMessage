import { prisma } from '$lib/backend/prisma/prisma';
import { generateRandomAvatar } from '$lib/helpers/RandomAvatar';
import { CurrUserScheme, UserScheme, UserStatus, idScheme } from '$lib/models';
import { z } from 'zod';

import { logger } from '../middleware/logger';
import { t } from '../t';

export const user = t.router({
	getById: t.procedure
		.use(logger)
		.input(idScheme)
		.query(async ({ input }) => {
			const user = await prisma.user.findUniqueOrThrow({
				where: {
					id: input
				},
				include: {
					channels: {
						select: {
							id: true
						}
					}
				}
			});

			const returnData = {
				...user,
				channels: user.channels.map((channel) => channel.id)
			};

			return UserScheme.parse(returnData);
		}),
	getByIdWithData: t.procedure
		.use(logger)
		.input(idScheme)
		.query(async ({ input }) => {
			const user = await prisma.user.findUniqueOrThrow({
				where: {
					id: input
				},
				include: {
					channels: true
				}
			});

			return CurrUserScheme.parse(user);
		}),
	create: t.procedure.use(logger).query(async () => {
		const user = await prisma.user.create({
			data: {
				name: 'New User',
				avatar: generateRandomAvatar(),
				status: UserStatus.Online
			},
			include: {
				channels: true
			}
		});

		return CurrUserScheme.parse(user);
	}),
	getAllByChannelId: t.procedure
		.use(logger)
		.input(idScheme)
		.query(async ({ input }) => {
			const users = await prisma.user.findMany({
				where: {
					channels: {
						some: {
							id: input
						}
					}
				}
			});

			return z.array(UserScheme).parse(users);
		})
});
