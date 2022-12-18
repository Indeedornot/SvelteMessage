import { prisma } from '$lib/backend/prisma/prisma';
import { generateRandomAvatar } from '$lib/helpers/RandomAvatar';
import { UserStatus } from '$lib/models';
import { UserScheme, idScheme, statusSchema } from '$lib/models/Schemas';
import { z } from 'zod';

import { t } from '../t';

export const user = t.router({
	getByStatus: t.procedure.input(statusSchema).query(async ({ input }) => {
		const users = await prisma.user.findMany({
			where: {
				status: input
			}
		});

		return z.array(UserScheme).parse(users);
	}),
	getById: t.procedure.input(idScheme).query(async ({ input }) => {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				id: input
			}
		});

		return UserScheme.parse(user);
	}),
	create: t.procedure.query(async () => {
		const user = await prisma.user.create({
			data: {
				name: 'New User',
				avatar: generateRandomAvatar(),
				status: UserStatus.Offline
			}
		});

		return UserScheme.parse(user);
	}),
	update: t.procedure.input(UserScheme.partial()).query(async ({ input }) => {
		const user = await prisma.user.update({
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
	delete: t.procedure.input(idScheme).query(async ({ input }) => {
		return await prisma.user.delete({
			where: {
				id: input
			}
		});
	}),
	getAll: t.procedure.query(async () => {
		const users = await prisma.user.findMany();

		return z.array(UserScheme).parse(users);
	})
});
