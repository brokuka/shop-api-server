import { pool } from './index.js'

export interface UserCredentials {
  email: string
  password: string
}

export interface TableUser {
  user_id: number
  name: Nullable<string>
  surname: Nullable<string>
  middlename: Nullable<string>
  email: string
  /**
   * Захешированный пароль
   */
  password: string
  group: string
}

export type UpdateUserData = Omit<TableUser, 'email' | 'password' | 'group'>

const userTable = await pool.query(`SELECT to_regclass('public.user');`)
export const isUserTableExist = Boolean(userTable.rows[0].to_regclass)

export async function createUserTable() {
  await pool.query(`
CREATE TABLE "user"
(
"user_id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
"name" VARCHAR(255) DEFAULT NULL,
"surname" VARCHAR(255) DEFAULT NULL,
"middlename" VARCHAR(255) DEFAULT NULL,
"email" VARCHAR(255) UNIQUE NOT NULL,
"password" VARCHAR NOT NULL,
"group" VARCHAR(128) DEFAULT 'default'
)
`)
}

export async function insertUserTable(credentials: UserCredentials) {
  const { email, password } = credentials

  const data = await pool.query<TableUser>(
`
INSERT INTO "user" (email, password)
VALUES ($1, $2)
RETURNING *
`,
[email, password],
  )

  return data.rows[0]
}

export async function updateUserTable(info: UpdateUserData) {
  const { name, surname, middlename, user_id } = info

  const data = await pool.query<TableUser>(
`
UPDATE "user"
SET "name" = $1, surname = $2, middlename = $3
WHERE "user_id" = $4
RETURNING *
`,
[name, surname, middlename, user_id],
  )

  return data.rows[0]
}

export async function dropUserTable() {
  await pool.query('DROP TABLE "user"')
}

export async function getUserByEmail(email: string) {
  const data = await pool.query<TableUser>(
`
SELECT *
FROM "user" WHERE "email" = $1
`,
[email],
  )

  return data.rows[0]
}

export async function getUserById(user_id: number) {
  const data = await pool.query<TableUser>(
`
SELECT *
FROM "user" WHERE "user_id" = $1
`,
[user_id],
  )

  return data.rows[0]
}
