// server.js
// The SocketIO stuff (see next step)
import injectSocketIO from '$lib/socketio/socket-handler.js';
import express from 'express';
import http from 'http';

import { handler } from './build/handler.js';

const app = express();
const server = http.createServer(app);

// Inject SocketIO
injectSocketIO(server);

// SvelteKit handlers
app.use(handler);

server.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});
