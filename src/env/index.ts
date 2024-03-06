import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') config({ path: '.env.test' })
else config()

const envSchema = z.object({
  NODE_ENV: z
    .enum(['production', 'development', 'test'])
    .default('development'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.string(),
  PORT: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('⚠️ Invalid environment variables', _env.error.errors)
  throw new Error('Invalid environment variables')
}

export const env = _env.data