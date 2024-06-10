import pg from 'pg'
import config from '../config.js'

const isConnectionStringExist = Boolean(config.DB_CONNECTION_STRING.length)

const { connectionString, ...rest } = {
  database: config.DB_DATABASE,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  host: config.DB_HOST,
  port: config.DB_PORT,
  connectionString: config.DB_CONNECTION_STRING,
}

export const pool = new pg.Pool(isConnectionStringExist ? { connectionString } : { ...rest })
