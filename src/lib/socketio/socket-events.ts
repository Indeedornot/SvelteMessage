import type { MessageData } from '$lib/models/MessageData';

export interface InterServerEvents {}

export interface ServerToClientEvents {
	MESSAGE: (message: MessageData) => void;
	NAME: (id: string) => void;
}

export interface ClientToServerEvents {
	MESSAGE: (message: MessageData) => void;
	NAME: () => void;
}
