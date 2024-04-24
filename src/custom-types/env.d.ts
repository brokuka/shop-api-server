declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_PORT: number

    SECRET_ACCESS_TOKEN: string
    SECRET_REFRESH_TOKEN: string

    REFRESH_TOKEN_EXPIRE_TIME: string
    ACCESS_TOKEN_EXPIRE_TIME: string
    COOKIE_TOKEN_LIFETIME: number

    DB_DATABASE: string
    DB_USER: string
    DB_PASSWORD: string
    DB_HOST: string
    DB_PORT: number
  }
}
