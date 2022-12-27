import type { z } from 'zod';

import type { RoleChangedScheme, RoleCreateApiScheme, RoleScheme } from './RoleSchema';

export type RoleData = z.infer<typeof RoleScheme>;
export type RoleCreateApiData = z.infer<typeof RoleCreateApiScheme>;
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
