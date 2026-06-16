import z from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production'], {
      error: iss =>
        iss.input === undefined
          ? 'NODE_ENV is required'
          : "NODE_ENV must be 'development' or 'production'",
    })
    .default('development'),
  PORT: z.coerce
    .number({
      error: iss =>
        iss.input === undefined
          ? 'PORT is required'
          : 'PORT must be a valid number',
    })
    .int({ error: 'PORT must be an integer' })
    .min(1, { error: 'PORT must be at least 1' })
    .max(65535, { error: 'PORT must be at most 65535' })
    .default(5000),
  MONGODB_URI: z
    .string({
      error: iss =>
        iss.input === undefined
          ? 'MongoDB uri is required'
          : 'MongoDB uri must be a string',
    })
    .min(1, { error: 'MongoDB uri cannot be empty' }),
  CLIENT_URL: z.url({
    error: iss =>
      iss.input === undefined
        ? 'Client url is required'
        : 'Client url must be a valid URL',
  }),
  JWT_ACCESS_TOKEN: z
    .string({
      error: iss =>
        iss.input === undefined
          ? 'JWT_ACCESS_TOKEN is required'
          : 'JWT_ACCESS_TOKEN must be a string',
    })
    .min(10, { error: 'JWT_ACCESS_TOKEN must be at least 10 character' }),
  JWT_REFRESH_TOKEN: z
    .string({
      error: iss =>
        iss.input === undefined
          ? 'JWT_REFRESH_TOKEN is required'
          : 'JWT_REFRESH_TOKEN must be a string',
    })
    .min(10, { error: 'JWT_REFRESH_TOKEN must be at least 10 character' }),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const formatted = result.error.flatten().fieldErrors;
  console.error('❌ Invalid environment variables:\n', formatted);
  process.exit(1);
}

const env = Object.freeze(result.data);

export default env;
