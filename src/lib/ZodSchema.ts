import { z } from 'zod/v4';

export const loginSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z.string().min(8, { error: "Password must be at least 8 characters" }),
});

export type LoginSchema = typeof loginSchema;
