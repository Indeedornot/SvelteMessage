import type { z } from 'zod';

import type { RoleChangedScheme, RoleCreateScheme, RoleSchema } from './RoleSchema';

export type RoleData = z.infer<typeof RoleSchema>;
export type RoleCreateApiData = z.infer<typeof RoleCreateScheme>;
export type RoleChangedData = z.infer<typeof RoleChangedScheme>;

export const RoleConstr = {
	name: { maxLength: 50, minLength: 1 }
};

export enum RolePermission {
	ManageRoles = 1,
	ManageChannel = 2,
	ManageMessages = 3
}

export const RolePermissionsNames = {
	[RolePermission.ManageRoles]: 'Manage roles',
	[RolePermission.ManageChannel]: 'Manage channel',
	[RolePermission.ManageMessages]: 'Manage messages'
};
