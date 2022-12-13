import { sveltekit } from '@sveltejs/kit/vite';

import { injectSocketIO } from './src/lib/socketio/socket-handler';

const webSocketServer = {
	name: 'sveltekit-socket-io',
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
