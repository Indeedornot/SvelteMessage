import type { Role } from '@prisma/client';

import type { ChannelData, CurrChannelData, UserData } from '$lib/models';
import type { RoleData } from '$lib/models/Role/RoleData';
import type { Buffer } from 'node:buffer';

import { prisma } from './prisma';

const toArrayInteger = (buffer: Buffer): number[] => {
	if (buffer.length > 0) {
		const data = new Array(buffer.length);
		for (let i = 0; i < buffer.length; i = i + 1) data[i] = buffer[i];
		return data;
	}
	return [];
};

export const mapRoles = (roles: Role[] | undefined): RoleData[] => {
	if (!roles) return [];
	return roles.map((role) => ({
		...role,
		permissions: toArrayInteger(role.permissions)
	}));
};

export const getCurrChannelById = async (user: {
	id: number;
	currChannelId: number | null;
}): Promise<CurrChannelData> => {
	if (!user.currChannelId) return null;
	const channel = await prisma.channel.findUniqueOrThrow({
		where: {
			id: user.currChannelId
		},
		select: {
			roles: true,
			owner: {
				select: {
					id: true
				}
			},
			id: true
		}
	});

	return {
		...channel,
		roles: mapRoles(channel.roles),
		owner: channel.owner.id === user.id
	};
};

export const getChannelsByUserId = async (userId: number): Promise<ChannelData[]> => {
	const channels = await prisma.channelUser.findMany({
		where: {
			userId: userId
		},
		select: {
			channel: {
				include: {
					roles: true
				}
			}
		}
	});

	return channels.map((x) => ({
		...x.channel,
		roles: mapRoles(x.channel.roles)
	}));
};

export const getOwnedByUserId = async (userId: number): Promise<number[]> => {
	const channels = await prisma.channel.findMany({
		where: {
			ownerId: userId
		},
		select: {
			id: true
		}
	});

	return channels.map((x) => x.id);
};
