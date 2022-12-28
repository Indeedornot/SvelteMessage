import { z } from 'zod';

export const idSchema = z.number().int().nonnegative();

export const dateSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());

const urlSchema = z.string().url();
export const avatarSchema = urlSchema;
