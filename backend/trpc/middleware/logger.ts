import { t } from '../t';

export const logger = t.middleware(async ({ path, type, next }) => {
	const start = Date.now();
	const result = await next();
	const ms = Date.now() - start;
	console.log(`[trpc] ${result.ok ? 'OK' : 'ERR'} ${type} ${path} - ${ms}ms`);
	return result;
});
