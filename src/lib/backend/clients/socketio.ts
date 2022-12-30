// src/lib/realtime.js
import type { ClientToServerEvents, ServerToClientEvents } from '$backend/socketio/socket-events';
import { Socket, io as ioClient } from 'socket.io-client';

const ENDPOINT = 'http://localhost:5173';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = ioClient(ENDPOINT);

export const io = socket;
