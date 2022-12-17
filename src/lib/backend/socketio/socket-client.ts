// src/lib/realtime.js
import { Socket, io as ioClient } from 'socket.io-client';

import type { ClientToServerEvents, ServerToClientEvents } from './socket-events';

const ENDPOINT = 'http://localhost:5173';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = ioClient(ENDPOINT);

export const io = socket;
