import type { Router } from '$backend/trpc/router';
import superjson from 'superjson';
import { type TRPCClientInit, createTRPCClient } from 'trpc-sveltekit';

let browserClient: ReturnType<typeof createTRPCClient<Router>>;

export function trpc(init?: TRPCClientInit) {
	if (typeof window === 'undefined') return createTRPCClient<Router>({ init, transformer: superjson });
	if (!browserClient) browserClient = createTRPCClient<Router>({ transformer: superjson });
	return browserClient;
}
