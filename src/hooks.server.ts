import type { Handle } from '@sveltejs/kit';

import { createContext } from '$lib/backend/trpc/context';
import { router } from '$lib/backend/trpc/router';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = createTRPCHandle({ router, createContext });
