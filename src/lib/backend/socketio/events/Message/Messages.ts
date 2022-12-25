import { MessageCreateApiScheme } from '../../../../models';
import { prisma } from '../../../prisma/prisma';
import type { typedServer, typedSocket } from '../../socket-handler';
import { roomFromChannel, socketUtil } from '../../socketUtils';

export const addMessageListener = (io: typedServer, socket: typedSocket) => {
	// Receive incoming messages and broadcast them
	socket.on('Message', async (newMessage) => {
		socketUtil.log('[Message] Message received');

		const user = socket.data.user;
		if (!user?.currChannel?.id) {
			socketUtil.error('[Message] User not found', user);
			return;
		}

		const parseData = MessageCreateApiScheme.safeParse(newMessage);
		if (!parseData.success) {
			socketUtil.error('[Message] Invalid message received', parseData.error);
			return;
		}

		const newMessageData = parseData.data;

		const message = await prisma.message.create({
			data: {
				text: newMessageData.text,
				sender: {
					connect: {
						id: user.id
					}
				},
				channel: {
					connect: {
						id: user.currChannel.id
					}
				}
			}
		});

		socketUtil.log('[Message] Message created', message, roomFromChannel(user.currChannel.id), socket.rooms);
		io.to(roomFromChannel(user.currChannel.id)).emit('Message', message);
	});

	socket.on('MessageDeleted', async (messageId) => {
		const user = socket.data.user;
		if (!user?.currChannel) {
			return;
		}

		const message = await prisma.message.findUnique({
			where: {
				id: messageId
			}
		});

		if (!message) return;

		if (message.senderId !== user.id && !user.currChannel.owner) return;

		await prisma.message.delete({
			where: {
				id: messageId
			}
		});

		socket.broadcast.to(roomFromChannel(user.currChannel.id)).emit('MessageDeleted', messageId);
	});

	socket.on('MessageChanged', async (messageId, data) => {
		socketUtil.log('[MessageChanged] Message changed', messageId, data);
		const user = socket.data.user;
		if (!user?.currChannel?.id) {
			socketUtil.error('[MessageChanged] User not in channel');
			return;
		}

		const message = await prisma.message.findUnique({
			where: {
				id: messageId
			}
		});

		if (!message) {
			socketUtil.error('[MessageChanged] Message not found');
			return;
		}
		if (message.senderId !== user.id) {
			socketUtil.error('[MessageChanged] User not message sender');
			return;
		}

		const { updatedAt } = await prisma.message.update({
			where: {
				id: messageId
			},
			data: {
				...data
			}
		});

		const updateData = {
			...data,
			updatedAt: updatedAt
		};

		socket.broadcast.to(roomFromChannel(user.currChannel.id)).emit('MessageChanged', messageId, updateData);
		socket.emit('MessageFinishedChanging', updateData);
	});
};
