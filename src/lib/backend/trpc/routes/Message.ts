import { prisma } from '$lib/backend/prisma/prisma';
import {
	MessageApiScheme,
	MessageCreateApiScheme,
	MessageScheme,
	UserScheme,
	avatarSchema,
	dateSchema,
	idScheme,
	statusSchema
} from '$lib/models/Schemas';
import { z } from 'zod';

import { t } from '../t';

export const message = t.router({
	getBySender: t.procedure.input(idScheme).query(({ input }) => {
		const messages = prisma.message.findMany({
			where: {
				senderId: input
			}
		});

		return z.array(MessageApiScheme).parse(messages);
	}),
	getById: t.procedure.input(idScheme).query(({ input }) => {
		const message = prisma.message.findUniqueOrThrow({
			where: {
				id: input
			}
		});

		return MessageApiScheme.parse(message);
	}),
	create: t.procedure.input(MessageCreateApiScheme).query(({ input }) => {
		const message = prisma.message.create({
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
	update: t.procedure.input(MessageApiScheme.partial().required({ id: true })).query(({ input }) => {
		const message = prisma.message.update({
			where: {
				id: input.id
			},
			data: {
				text: input.text,
				timestamp: input.timestamp,
				senderId: input.senderId
			}
		});

		return MessageApiScheme.parse(message);
	}),
	delete: t.procedure.input(idScheme).query(({ input }) => {
		return prisma.message.delete({
			where: {
				id: input
			}
		});
	}),
	getMessages: t.procedure.input(z.number().int().min(1)).query(({ input }) => {
		const messages = prisma.message.findMany({
			take: input,
			orderBy: {
				timestamp: 'desc'
			}
		});

		return z.array(MessageApiScheme).parse(messages);
	}),
	getMessagesWithSender: t.procedure.input(z.number().int().min(1)).query(({ input }) => {
		const messages = prisma.message.findMany({
			take: input,
			orderBy: {
				timestamp: 'desc'
			},
			include: {
				sender: true
			}
		});

		return z.array(MessageScheme).parse(messages);
	})
});
