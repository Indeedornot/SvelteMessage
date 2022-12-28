import { prisma } from '$lib/backend/prisma/prisma';
import { MessageApiScheme, idSchema } from '$lib/models';
import { z } from 'zod';

import { logger } from '../middleware/logger';
import { t } from '../t';

export const message = t.router({
	getById: t.procedure
		.use(logger)
		.input(idSchema)
		.query(async ({ input }) => {
			const message = await prisma.message.findUniqueOrThrow({
				where: {
					id: input
				}
			});

			return MessageApiScheme.parse(message);
		}),
	get: t.procedure
		.use(logger)
		.input(z.number().int().min(1))
		.query(async ({ input }) => {
			const messages = await prisma.message.findMany({
				take: input,
				orderBy: {
					createdAt: 'desc'
				}
			});

			messages.reverse();

			return z.array(MessageApiScheme).parse(messages);
		}),
	getByChannelId: t.procedure
		.use(logger)
		.input(z.object({ channelId: idSchema, take: z.number().int().min(1) }))
		.query(async ({ input }) => {
			const messages = await prisma.message.findMany({
				where: {
					channelId: input.channelId
				},
				take: input.take,
				orderBy: {
					createdAt: 'desc'
				}
			});

			messages.reverse();

			return z.array(MessageApiScheme).parse(messages);
		})
});
