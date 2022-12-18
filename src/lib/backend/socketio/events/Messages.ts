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
};
