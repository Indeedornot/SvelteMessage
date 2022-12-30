import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { channel } from './routes/Channel';
import { channelUser } from './routes/ChannelUser';
import { message } from './routes/Message';
import { user } from './routes/User';
import { t } from './t';

export const router = t.router({
	user,
	message,
	channel,
	channelUser
});

export type Router = typeof router;

export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
