import { z } from 'zod';

import { RoleConstr } from './RoleData';

const roleNameSchema = z.string().min(RoleConstr.name.minLength).max(RoleConstr.name.maxLength);
const roleOrderSchema = z.number().int().min(0);

export const RoleSchema = z.object({
	id: z.number(),
	name: roleNameSchema,
	permissions: z.array(z.number()),
	order: roleOrderSchema,
	hidden: z.boolean()
});

export const RoleCreateScheme = z.object({
	name: roleNameSchema,
	permissions: z.array(z.number())
});

export const RoleChangedScheme = z.object({
	name: roleNameSchema.optional(),
	permissions: z.array(z.number()).optional()
});
