import { sveltekit } from '@sveltejs/kit/vite';

import { injectSocketIO } from './backend/socketio/socket-handler';

const webSocketServer = {
	name: 'sveltekit-socket-io',
	//@ts-expect-error - until sveltekit supports websockets
	configureServer(server) {
		console.log('configureServer');
		injectSocketIO(server);
	}
};

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), webSocketServer]
};

export default config;
