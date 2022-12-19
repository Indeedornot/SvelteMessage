import { MessageCreateApiScheme } from '../../../models';
import { prisma } from '../../prisma/prisma';
import type { typedServer, typedSocket } from '../socket-handler';

export const addMessageListener = (io: typedServer, socket: typedSocket) => {
	// Receive incoming messages and broadcast them
	socket.on('Message', async (newMessage) => {
		const parseData = MessageCreateApiScheme.safeParse(newMessage);
		if (!parseData.success) {
			console.error('Invalid message received', parseData.error);
			return;
		}

		console.log('Message received', parseData.data);
		const newMessageData = parseData.data;

		const message = await prisma.message.create({
			data: {
				text: newMessageData.text,
				timestamp: newMessageData.timestamp,
				sender: {
					connect: {
						id: newMessageData.senderId
					}
				}
			}
		});

		io.emit('Message', message);
	});

	socket.on('MessageDeleted', async (messageId) => {
		if (!socket.data.user) return;

		const message = await prisma.message.findUnique({
			where: {
				id: messageId
			}
		});

		if (!message) return;

		if (message.senderId !== socket.data.user.id) return;

		await prisma.message.delete({
			where: {
				id: messageId
			}
		});

		socket.broadcast.emit('MessageDeleted', messageId);
	});

	socket.on('MessageChanged', async (messageId, data) => {
		if (!socket.data.user) return;

		const message = await prisma.message.findUnique({
			where: {
				id: messageId
			}
		});

		if (!message) return;
		if (message.senderId !== socket.data.user.id) return;

		await prisma.message.update({
			where: {
				id: messageId
			},
			data: {
				...data
			}
		});

		socket.broadcast.emit('MessageChanged', messageId, data);
	});
};
