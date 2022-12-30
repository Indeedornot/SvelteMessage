import type { Role } from '@prisma/client';

import type { Buffer } from 'node:buffer';

import type { ChannelData, ChannelUserData, MessageApiData, RoleData, UserApiData } from '../imports/models';
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

export const getRolesByChannelId = async (channelId: number): Promise<RoleData[]> => {
	const roles = await prisma.role.findMany({
		where: { channelId: channelId }
	});

	return mapRoles(roles);
};

export const getRolesByChannelUserId = async (channelUserId: number): Promise<RoleData[]> => {
	const channelUser = await prisma.channelUser.findUnique({
		where: { id: channelUserId },
		include: {
			roles: true
		}
	});

	if (!channelUser) return [];

	return mapRoles(channelUser.roles);
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

export const getMessagesByChannelId = async (channelId: number, count: number): Promise<MessageApiData[]> => {
	const messages = await prisma.message.findMany({
		where: { channelId: channelId },
		take: count,
		orderBy: { createdAt: 'desc' },
		include: {
			sender: {
				select: { id: true }
			}
		}
	});

	messages.reverse();

	return messages.map((x) => ({
		...x,
		senderId: x.sender.id
	}));
};

export const getUsersByChannelId = async (channelId: number, exclude: number[] = []): Promise<UserApiData[]> => {
	const users = await prisma.channelUser.findMany({
		where: {
			channelId: channelId,
			userId: { notIn: exclude }
		},
		select: {
			user: {
				include: {
					channelUser: {
						where: { channelId: channelId },
						take: 1,
						include: {
							roles: true
						}
					}
				}
			}
		}
	});

	//@ts-expect-error - UserStatus is not defined in prisma
	return users.map((x) => {
		return {
			...x.user,
			channelUser: {
				...x.user.channelUser[0],
				roles: mapRoles(x.user.channelUser[0].roles)
			}
		};
	});
};

/** Returns UserData with channelUser of channelId or if none - currChannelId */
export const getUserById = async (input: { id: number; channelId?: number }): Promise<UserApiData> => {
	const user = await prisma.user.findUniqueOrThrow({
		where: { id: input.id }
	});

	let channelUser: ChannelUserData | null = null;
	if (input.channelId || user.currChannelId) {
		channelUser = await getChannelUserByData(user.id, input.channelId ?? user.currChannelId!);
	}

	return {
		...user,
		status: user.status as never,
		channelUser: channelUser
	};
};

export const getChannelUsersByUserId = async (userId: number): Promise<ChannelUserData[]> => {
	const channelUsers = await prisma.channelUser.findMany({
		where: { userId: userId },
		include: { roles: true }
	});

	return channelUsers.map((x) => ({
		...x,
		roles: mapRoles(x.roles)
	}));
};

export const getChannelUserByData = async (userId: number, channelId: number): Promise<ChannelUserData | null> => {
	const channelUser = await prisma.channelUser.findUnique({
		where: { channelId_userId: { channelId: channelId, userId: userId } },
		include: { roles: true }
	});

	if (!channelUser) return null;

	return {
		...channelUser,
		roles: mapRoles(channelUser.roles)
	};
};

export const getChannelById = async (channelId: number): Promise<ChannelData> => {
	const channel = await prisma.channel.findUniqueOrThrow({
		where: { id: channelId },
		include: { roles: true }
	});

	return {
		...channel,
		roles: mapRoles(channel.roles)
	};
};
