import { MessageNewScheme, MessageToData } from '../../models';
import { prisma } from '../../prisma/prisma';
import type { typedServer, typedSocket } from '../socket-handler';

export const addMessageListener = (io: typedServer, socket: typedSocket) => {
	socket.on('MessagesHistory', async (count: number) => {
		// Send the list of X messages to the new user
		const messages = await prisma.message.findMany({
			take: count,
			orderBy: {
				timestamp: 'desc'
			},
			include: {
				sender: true
			}
		});

		socket.emit('MessagesHistory', messages.map(MessageToData));
	});

	// Receive incoming messages and broadcast them
	socket.on('Message', async (newMessage) => {
		const parseData = MessageNewScheme.safeParse(newMessage);
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
						id: newMessageData.sender.id
					}
				}
			},
			include: {
				sender: true
			}
		});

		io.emit('Message', MessageToData(message));
	});
};
