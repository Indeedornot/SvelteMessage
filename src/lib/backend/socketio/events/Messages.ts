import { MessageCreateApiScheme } from '../../../models';
import { prisma } from '../../prisma/prisma';
import type { typedServer, typedSocket } from '../socket-handler';

export const addMessageListener = (io: typedServer, socket: typedSocket) => {
	// Receive incoming messages and broadcast them
	socket.on('Message', async (newMessage) => {
		if (!socket.data.user) return;

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
				sender: {
					connect: {
						id: socket.data.user?.id
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

		socket.broadcast.emit('MessageChanged', messageId, updateData);

		socket.emit('MessageFinishedChanging', updateData);
	});
};
