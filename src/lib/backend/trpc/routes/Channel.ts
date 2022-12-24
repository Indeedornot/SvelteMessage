import { prisma } from '$lib/backend/prisma/prisma';
import { ChannelApiScheme, ChannelCreateApiScheme, ChannelScheme, idScheme } from '$lib/models';
import { z } from 'zod';

import { logger } from '../middleware/logger';
import { t, trpcUtils } from '../t';

export const channel = t.router({
	getByIdWithData: t.procedure
		.use(logger)
		.input(
			z.object({
				id: idScheme,
				messageCount: z.number().min(0).max(100)
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
						orderBy: { createdAt: 'desc' }
					},
					users: {
						include: {
							channels: { select: { id: true } }
						}
					}
				}
			});
			channel.messages.reverse();
			trpcUtils.log(channel.messages);

			const returnData = {
				...channel,
				users: channel.users.map((user) => {
					return {
						...user,
						//flatten from [{id: 1}, {id: 2}] to [1, 2]
						channels: user.channels.map((channel) => channel.id)
					};
				})
			};

			return ChannelApiScheme.parse(returnData);
		}),
	getById: t.procedure
		.use(logger)
		.input(idScheme)
		.query(async ({ input }) => {
			const channel = await prisma.channel.findUniqueOrThrow({
				where: { id: input }
			});

			const parseData = ChannelScheme.safeParse(channel);
			if (!parseData.success) {
				return null;
			}

			return parseData.data;
		}),
	getByUserId: t.procedure
		.use(logger)
		.input(idScheme)
		.query(async ({ input }) => {
			const channels = await prisma.user
				.findUniqueOrThrow({
					where: { id: input }
				})
				.channels();

			return z.array(ChannelScheme).parse(channels);
		}),
	create: t.procedure
		.use(logger)
		.input(ChannelCreateApiScheme)
		.query(async ({ input }) => {
			const channel = await prisma.channel.create({
				data: {
					...input
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
