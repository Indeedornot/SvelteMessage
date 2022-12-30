import type { Handle } from '@sveltejs/kit';

import { createContext } from '$backend/trpc/context';
import { router } from '$backend/trpc/router';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = createTRPCHandle({ router, createContext });
