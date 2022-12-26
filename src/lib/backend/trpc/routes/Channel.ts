import { prisma } from '$lib/backend/prisma/prisma';
import {
	type ChannelApiData,
	ChannelApiScheme,
	ChannelCreateApiScheme,
	type ChannelData,
	ChannelScheme,
	idScheme
} from '$lib/models';
import { z } from 'zod';

import { logger } from '../middleware/logger';
import { t, trpcUtils } from '../t';

export const channel = t.router({
	getByIdWithData: t.procedure
		.use(logger)
		.input(
			z.object({
				id: idScheme,
				messageCount: z.number().min(0).max(100),
				excludeId: idScheme.optional()
			})
		)
		.query(async ({ input }) => {
			const channel = await prisma.channel.findUniqueOrThrow({
				where: {
					id: input.id
				},
				include: {
					messages: {
						take: input.messageCount,
						orderBy: { createdAt: 'desc' },
						include: {
							sender: {
								select: {
									id: true
								}
							}
						}
					},
					users: {
						where: input.excludeId ? { NOT: { userId: input.excludeId } } : undefined,
						select: {
							user: {
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
							}
						}
					}
				}
			});

			channel.messages.reverse();
			trpcUtils.log(channel.messages);

			const returnData: ChannelApiData = {
				...channel,
				messages: channel.messages.map((message) => {
					return {
						...message,
						senderId: message.sender.id
					};
				}),
				users: channel.users.map((x) => {
					return {
						id: x.user.id,
						name: x.user.name,
						avatar: x.user.avatar,
						online: x.user.online,
						status: x.user.status as any,
						//flatten from [{id: 1}, {id: 2}] to [1, 2]
						channels: x.user.channelUser.map((y) => y.channel.id)
					};
				})
			};

			return ChannelApiScheme.parse(returnData);
		}),
	getById: t.procedure
		.use(logger)
		.input(idScheme)
		.query(async ({ input }) => {
			const channel = await prisma.channel.findUnique({
				where: { id: input }
			});

			if (!channel) {
				return null;
			}

			const returnData: ChannelData = {
				avatar: channel.avatar,
				createdAt: channel.createdAt,
				id: channel.id,
				name: channel.name,
				ownerId: channel.ownerId,
				updatedAt: channel.updatedAt
			};

			const parseData = ChannelScheme.safeParse(returnData);
			if (!parseData.success) {
				console.error(parseData.error);
				return null;
			}

			return parseData.data;
		}),
	getByUserId: t.procedure
		.use(logger)
		.input(idScheme)
		.query(async ({ input }) => {
			const channels = await prisma.user.findUniqueOrThrow({
				where: { id: input },
				include: {
					channelUser: {
						select: {
							channel: true
						}
					}
				}
			});

			const returnData: ChannelData[] = channels.channelUser.map((x) => x.channel);
			return z.array(ChannelScheme).parse(returnData);
		}),
	create: t.procedure
		.use(logger)
		.input(ChannelCreateApiScheme)
		.query(async ({ input }) => {
			const channel = await prisma.channel.create({
				data: {
					name: input.name,
					avatar: input.avatar,
					ownerId: input.creatorId,
					creatorId: input.creatorId
				}
			});

			return ChannelScheme.parse(channel);
		}),
	delete: t.procedure
		.use(logger)
		.input(idScheme)
		.query(async ({ input }) => {
			await prisma.channel.delete({
				where: { id: input }
			});
		})
});
