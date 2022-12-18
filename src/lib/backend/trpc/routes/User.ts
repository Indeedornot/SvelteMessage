import { prisma } from '$lib/backend/prisma/prisma';
import { UserScheme, idScheme, statusSchema } from '$lib/models/Schemas';
import { z } from 'zod';

import { t } from '../t';

export const user = t.router({
	getByStatus: t.procedure.input(statusSchema).query(({ input }) => {
		const users = prisma.user.findMany({
			where: {
				status: input
			}
		});

		return z.array(UserScheme).parse(users);
	}),
	getById: t.procedure.input(idScheme).query(({ input }) => {
		const user = prisma.user.findUniqueOrThrow({
			where: {
				id: input
			}
		});

		return UserScheme.parse(user);
	}),
	create: t.procedure.input(UserScheme.omit({ id: true })).query(({ input }) => {
		const user = prisma.user.create({
			data: {
				name: input.name,
				avatar: input.avatar,
				status: input.status
			}
		});

		return UserScheme.parse(user);
	}),
	update: t.procedure.input(UserScheme.partial()).query(({ input }) => {
		const user = prisma.user.update({
			where: {
				id: input.id
			},
			data: {
				name: input.name,
				avatar: input.avatar,
				status: input.status
			}
		});

		return UserScheme.parse(user);
	}),
	delete: t.procedure.input(idScheme).query(({ input }) => {
		return prisma.user.delete({
			where: {
				id: input
			}
		});
	})
});
