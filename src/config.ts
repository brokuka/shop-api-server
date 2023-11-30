import { cleanEnv, str, num } from "envalid";

const config = cleanEnv(process.env, {
  SERVER_PORT: num(),

  SECRET_ACCESS_TOKEN: str(),
  SECRET_REFRESH_TOKEN: str(),
  SECRET_SESSION_TOKEN: str(),

  REFRESH_TOKEN_EXPIRE_TIME: str(),
  ACCESS_TOKEN_EXPIRE_TIME: str(),
  COOKIE_TOKEN_LIFETIME: num(),

  DB_DATABASE: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_HOST: str(),
  DB_PORT: num(),

  DB_CONNECTION_STRING: str(),
});

export default config;
