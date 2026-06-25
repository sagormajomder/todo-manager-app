import z from 'zod';

const isProdMin = process.env.NODE_ENV === 'production' ? 32 : 16;

const envSchema = z.object({
  NODE_ENV: z
    .string()
    .trim()
    .pipe(
      z.enum(['development', 'test', 'production'], {
        error: "NODE_ENV must be 'development', 'test' or 'production'",
      }),
    )
    .default('development'),
  PORT: z.coerce
    .number({
      error: 'Port must be a valid number',
    })
    .int({ error: 'PORT must be an integer' })
    .min(1, { error: 'PORT must be at least 1' })
    .max(65535, { error: 'PORT must be at most 65535' })
    .default(5000),
  MONGODB_URI: z
    .string({
      error: 'Mongodb is required',
    })
    .trim()
    .min(1, { error: 'MongoDB uri cannot be empty' })
    .refine(
      value =>
        value.startsWith('mongodb://') || value.startsWith('mongodb+srv://'),
      { error: 'MONGODB_URI must start with mongodb:// or mongodb+srv://' },
    ),
  CLIENT_URL: z
    .string({ error: 'Client URI is required' })
    .trim()
    .min(1, { error: 'Client url cannot be empty' })
    .pipe(
      z.url({
        error: 'CLIENT_URL must be a valid URL (e.g. http://localhost:5173)',
      }),
    ),
  JWT_ACCESS_SECRET: z
    .string({
      error: 'JWT_ACCESS_SECRET is required',
    })
    .trim()
    .min(isProdMin, {
      error: `JWT_ACCESS_SECRET must be at least ${isProdMin} character`,
    }),
  JWT_REFRESH_SECRET: z
    .string({
      error: 'JWT_REFRESH_SECRET is required',
    })
    .trim()
    .min(isProdMin, {
      error: `JWT_REFRESH_SECRET must be at least ${isProdMin} character`,
    }),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z
    .string()
    .trim()
    .transform(v => (v === '' ? undefined : v))
    .default('15m'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z
    .string()
    .trim()
    .transform(v => (v === '' ? undefined : v))
    .default('15m'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const errors = result.error.issues
    .map(
      iss =>
        iss.path.length > 0 && `  •  ${iss.path.join('.')}: ${iss.message}`,
    )
    .join('\n');

  console.error(`❌ Invalid environment variables:\n${errors}\n`);
  process.exit(1);
}

const parsedData = result.data;

if (parsedData.JWT_ACCESS_SECRET === parsedData.JWT_REFRESH_SECRET) {
  console.error(
    '❌ JWT ACCESS SECRET and JWT REFRESH SECRET must be different',
  );
  process.exit(1);
}

const env = Object.freeze(parsedData);

export default env;
