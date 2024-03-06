import { Knex, knex as knexConfig } from 'knex'
import { env } from './env'

if (!process.env.DATABASE_URL || !process.env.DATABASE_CLIENT) {
  throw new Error('Cannot found env variables')
}

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = knexConfig(config)
