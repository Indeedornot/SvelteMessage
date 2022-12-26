import { z } from 'zod';

import { RoleConstr } from './RoleData';

const roleNameScheme = z.string().min(RoleConstr.name.minLength).max(RoleConstr.name.maxLength);
const roleOrderScheme = z.number().int().min(0);

export const RoleScheme = z.object({
	id: z.number(),
	name: roleNameScheme,
	permissions: z.array(z.number()),
	order: roleOrderScheme
});

export const RoleCreateApiScheme = z.object({
	name: roleNameScheme,
	permissions: z.array(z.number())
});

export const RoleChangedScheme = z.object({
	name: roleNameScheme.optional(),
	permissions: z.array(z.number()).optional()
});
