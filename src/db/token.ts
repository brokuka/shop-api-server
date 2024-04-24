import { pool } from './index.js'

export interface TableToken {
  token_id: number
  token: string
  user_id: number
}

const tokenTable = await pool.query(`SELECT to_regclass('public.token');`)
export const isTokenTableExist = Boolean(tokenTable.rows[0].to_regclass)

export async function createTokenTable() {
  await pool.query(`
CREATE TABLE "token"
(
"token_id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
"token" VARCHAR NOT NULL,
"user_id" INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE
)
`)
}

export async function insertTokenTable(user_id: number, token: string) {
  const data = await pool.query<TableToken>(
`
INSERT INTO "token" (user_id, token)
VALUES ($1, $2)
`,
[user_id, token],
  )

  return data.rows[0]
}

export async function dropTokenTable() {
  await pool.query('DROP TABLE "user"')
}

export async function getTokenByUserId(user_id: number) {
  const data = await pool.query<TableToken>(
`
SELECT *
FROM "token" WHERE "user_id" = $1
`,
[user_id],
  )

  return data.rows[0]
}

export async function updateTokenByUserId(user_id: number, token: string) {
  await pool.query<TableToken>(
`
UPDATE "token" SET token = ($1)
WHERE user_id = ($2)
`,
[token, user_id],
  )
}
