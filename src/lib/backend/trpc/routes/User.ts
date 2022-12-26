import { prisma } from '$lib/backend/prisma/prisma';
import { socketUtil } from '$lib/backend/socketio/socketUtils';
import { generateRandomAvatar } from '$lib/helpers/RandomAvatar';
import { type CurrUserData, CurrUserScheme, type UserData, UserScheme, UserStatus, idScheme } from '$lib/models';
import { z } from 'zod';

import { logger } from '../middleware/logger';
import { t, trpcUtils } from '../t';

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
				},
				include: {
					channelUser: {
						select: {
							channel: true
						}
					},
					owned: {
						select: {
							id: true
						}
					},
					currChannel: {
						select: {
							id: true,
							owner: {
								select: {
									id: true
								}
							},
							roles: true
						}
					}
				}
			});

			const returnData: CurrUserData = {
				...user,
				status: user.status as never,
				channels: user.channelUser.map((x) => x.channel),
				currChannel: user.currChannel
					? {
							id: user.currChannel.id,
							owner: user.currChannel.owner.id === user.id
					  }
					: null,
				owned: user.owned.map((x) => x.id)
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
