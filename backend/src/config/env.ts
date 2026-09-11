import 'dotenv/config';

import { z } from 'zod';
import type { SignOptions } from 'jsonwebtoken';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(5000),

  FRONTEND_URL: z
    .url()
    .default('http://localhost:5173'),

  JWT_ACCESS_SECRET: z
    .string()
    .min(32),

  JWT_REFRESH_SECRET: z
    .string()
    .min(32),

  JWT_ACCESS_EXPIRES_IN: z
    .string()
    .default('15m') as z.ZodType<SignOptions['expiresIn']>,

  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .default('7d') as z.ZodType<SignOptions['expiresIn']>,
});

export const env = envSchema.parse(process.env);