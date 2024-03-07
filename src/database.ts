import { Knex, knex as knexConfig } from 'knex'
import { env } from './env'

const connection =
  env.DATABASE_CLIENT === 'sqlite'
    ? { filename: env.DATABASE_URL }
    : env.DATABASE_URL

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = knexConfig(config)
