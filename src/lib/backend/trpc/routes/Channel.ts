import { prisma } from '$lib/backend/prisma/prisma';
import {
	type ChannelApiData,
	ChannelApiSchema,
	ChannelCreateSchema,
	type ChannelData,
	ChannelSchema,
	idSchema
} from '$lib/models';
import { z } from 'zod';

import {
	getChannelsByUserId,
	getMessagesByChannelId,
	getRolesByChannelId,
	getUsersByChannelId
} from '../../prisma/helpers';
import { logger } from '../middleware/logger';
import { t } from '../t';

export const channel = t.router({
	getByIdWithData: t.procedure
		.use(logger)
		.input(
			z.object({
				id: idSchema,
				messageCount: z.number().min(0).max(100),
				excludeId: idSchema.optional()
			})
		)
		.query(async ({ input }) => {
			const channel = await prisma.channel.findUniqueOrThrow({
				where: {
					id: input.id
				}
			});

			const roles = await getRolesByChannelId(channel.id);
			const messages = await getMessagesByChannelId(channel.id, input.messageCount);
			const users = await getUsersByChannelId(channel.id, input.excludeId ? [input.excludeId] : []);

			const returnData: ChannelApiData = {
				...channel,
				messages: messages,
				users: users,
				roles: roles
			};

			return ChannelApiSchema.parse(returnData);
		}),
	getById: t.procedure
		.use(logger)
		.input(idSchema)
		.query(async ({ input }) => {
			const channel = await prisma.channel.findUnique({ where: { id: input } });
			if (!channel) return null;

			const roles = await getRolesByChannelId(channel.id);
			const returnData: ChannelData = {
				...channel,
				roles: roles
			};

			return ChannelSchema.parse(returnData);
		}),
	getByUserId: t.procedure
		.use(logger)
		.input(idSchema)
		.query(async ({ input }) => {
			const channels: ChannelData[] = await getChannelsByUserId(input);
			return z.array(ChannelSchema).parse(channels);
		}),
	create: t.procedure
		.use(logger)
		.input(ChannelCreateSchema)
		.query(async ({ input }) => {
			const channel = await prisma.channel.create({
				data: {
					name: input.name,
					avatar: input.avatar,
					creatorId: input.creatorId
				}
			});

			const returnData: ChannelData = { ...channel, roles: [] };
			//! ADD OWNER ROLE
			return ChannelSchema.parse(returnData);
		}),
	delete: t.procedure
		.use(logger)
		.input(idSchema)
		.query(async ({ input }) => {
			await prisma.channel.delete({
				where: { id: input }
			});
		})
});
