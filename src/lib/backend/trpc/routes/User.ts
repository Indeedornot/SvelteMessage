import { prisma } from '$lib/backend/prisma/prisma';
import { generateRandomAvatar } from '$lib/helpers/RandomAvatar';
import { type CurrUserData, CurrUserScheme, type UserData, UserScheme, UserStatus, idScheme } from '$lib/models';
import { z } from 'zod';

import { getChannelsByUserId, getCurrChannelById, getOwnedByUserId, mapRoles } from '../../prisma/helpers';
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
					channelUser: {
						select: {
							channel: {
								select: {
									id: true
								}
							}
						}
					}
				}
			});

			const returnData = {
				...user,
				channels: user.channelUser.map((x) => x.channel.id)
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
				}
			});

			const currChannel = await getCurrChannelById(user);
			const channels = await getChannelsByUserId(user.id);
			const owned = await getOwnedByUserId(user.id);

			const returnData: CurrUserData = {
				...user,
				status: user.status as never,
				channels: channels,
				currChannel: currChannel,
				owned: owned
			};

			return CurrUserScheme.parse(returnData);
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

		const returnData: CurrUserData = {
			...user,
			status: user.status as never,
			channels: [],
			owned: [],
			currChannel: null
		};

		return CurrUserScheme.parse(returnData);
	}),
	getAllByChannelId: t.procedure
		.use(logger)
		.input(idScheme)
		.query(async ({ input }) => {
			const users = await prisma.user.findMany({
				where: {
					channelUser: {
						some: {
							channelId: input
						}
					}
				},
				include: {
					channelUser: {
						select: {
							channel: {
								select: {
									id: true
								}
							}
						}
					}
				}
			});

			const returnData: UserData[] = users.map((user) => {
				return {
					...user,
					status: user.status as never,
					channels: user.channelUser.map((x) => x.channel.id)
				};
			});

			return z.array(UserScheme).parse(returnData);
		})
});
