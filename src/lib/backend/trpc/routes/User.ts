import { prisma } from '$lib/backend/prisma/prisma';
import { generateRandomAvatar } from '$lib/helpers/RandomAvatar';
import { UserStatus } from '$lib/models';
import { UserScheme, idScheme } from '$lib/models/Schemas';
import { z } from 'zod';

import { t } from '../t';

export const user = t.router({
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
				status: UserStatus.Online
			}
		});

		return UserScheme.parse(user);
	}),
	getAll: t.procedure.query(async () => {
		const users = await prisma.user.findMany();

		return z.array(UserScheme).parse(users);
	})
});
