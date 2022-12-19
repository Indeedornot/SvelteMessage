import { prisma } from '$lib/backend/prisma/prisma';
import { MessageApiScheme, MessageCreateApiScheme, idScheme } from '$lib/models/Schemas';
import { z } from 'zod';

import { t } from '../t';

export const message = t.router({
	getById: t.procedure.input(idScheme).query(async ({ input }) => {
		const message = await prisma.message.findUniqueOrThrow({
			where: {
				id: input
			}
		});

		return MessageApiScheme.parse(message);
	}),
	create: t.procedure.input(MessageCreateApiScheme).query(async ({ input }) => {
		const message = await prisma.message.create({
			data: {
				text: input.text,
				timestamp: input.timestamp,
				sender: {
					connect: {
						id: input.senderId
					}
				}
			}
		});

		return MessageApiScheme.parse(message);
	}),
	getMessages: t.procedure.input(z.number().int().min(1)).query(async ({ input }) => {
		const messages = await prisma.message.findMany({
			take: input,
			orderBy: {
				timestamp: 'desc'
			}
		});

		messages.reverse();

		return z.array(MessageApiScheme).parse(messages);
	})
});
