import { cleanEnv, num, str } from 'envalid'
import type { CookieOptions } from 'express'

const config = cleanEnv(process.env, {
  SERVER_PORT: num(),

  SECRET_ACCESS_TOKEN: str(),
  SECRET_REFRESH_TOKEN: str(),
  SECRET_SESSION_TOKEN: str(),

  REFRESH_TOKEN_EXPIRE_TIME: str(),
  ACCESS_TOKEN_EXPIRE_TIME: str(),
  COOKIE_TOKEN_LIFETIME: num(),

  // Добавляем значение по умолчанию, т.к есть варианты подключения к базе данных
  DB_DATABASE: str({
    default: '',
  }),

  DB_USER: str({
    default: '',
  }),

  DB_PASSWORD: str({
    default: '',
  }),

  DB_HOST: str({
    default: '',
  }),

  DB_PORT: num({
    default: 5432,
  }),

  DB_CONNECTION_STRING: str({
    default: '',
  }),
})

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: config.COOKIE_TOKEN_LIFETIME,
  sameSite: config.isProduction ? 'none' : 'lax',
  secure: config.isProduction,
}

export default config
