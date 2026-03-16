import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Include at least one letter and one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const transferSchema = z.object({
  fromAccountId: z.string().optional(),
  toAccount: z.string().min(12, 'Enter a valid 12-digit account number').max(24),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  description: z.string().max(280, 'Description is too long').optional().or(z.literal('')),
  idempotencyKey: z.string().min(10),
});
