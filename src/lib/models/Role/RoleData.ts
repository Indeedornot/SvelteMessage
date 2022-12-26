export type RoleData = {
	id: number;
	order: number;
	name: string;
	permissions: number[];
};

export type RoleCreateApiData = {
	name: string;
	order?: number; //default is end
	permissions: number[];
};

export type RoleChangedData = {
	name?: string;
	order?: number;
	permissions?: number[];
};

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
