import { VALIDATIONS } from '@/utils/constants.js';
import z from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: iss =>
          iss.input === undefined
            ? 'Name is required'
            : 'User type should be string',
      })
      .trim()
      .min(3, { error: 'Name should have at least 3 characters' })
      .max(50, { error: "Name shouldn't exceed 50 characters" }),
    email: z
      .string({
        error: iss =>
          iss.input === undefined
            ? 'Email is required'
            : 'Email type should be string',
      })
      .trim()
      .toLowerCase()
      .regex(VALIDATIONS.EMAIL_REGEX_PATTERN, {
        error: 'Please provide a valid Email',
      }),
    password: z
      .string({
        error: iss =>
          iss.input === undefined
            ? 'Password is required'
            : 'Password type should be string',
      })
      .min(VALIDATIONS.PASSWORD_MIN_LENGTH, {
        error: `Password Must be at least ${VALIDATIONS.PASSWORD_MIN_LENGTH} characters long`,
      })
      .regex(/[a-z]/, {
        error: 'Password should have at least one lowercase letter',
      })
      .regex(/[A-Z]/, {
        error: 'Password should have at least one uppercase letter',
      })
      .regex(/\d/, {
        error: 'Password should have at least one digit',
      })
      .regex(/[^a-zA-Z0-9]/, {
        error: 'Password should have at least one special characters',
      }),
  }),
});
