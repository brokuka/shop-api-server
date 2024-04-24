import pg from 'pg'
import config from '../config.js'

const production = {
  connectionString: config.DB_CONNECTION_STRING,
}

const dev = {
  database: config.DB_DATABASE,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  host: config.DB_HOST,
  port: config.DB_PORT,
}

export const pool = new pg.Pool(config.isProduction ? production : dev)
