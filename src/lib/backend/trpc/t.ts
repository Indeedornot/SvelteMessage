import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

import type { Context } from './context';
import { logger } from './middleware/logger';

export const t = initTRPC.context<Context>().create({
	transformer: superjson
});

export const customProcedure = t.procedure.use(logger);

export const trpcUtils = {
	log: (...args: any[]) => {
		console.log('[trpc] [log]', ...args);
	},
	error: (...args: any[]) => {
		console.error('[trpc] [error]', ...args);
	}
};
