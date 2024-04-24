import type { Product } from '../utils/schemas.js'
import { pool } from './index.js'

export type TableProduct = Omit<Product, 'id' | 'rating'> & {
  product_id: number
}

const productTable = await pool.query(`SELECT to_regclass('public.product');`)
export const isProductTableExist = Boolean(productTable.rows[0].to_regclass)

export async function createProductTable(data: TableProduct[]) {
  await pool.query(`
CREATE TABLE "product"
(
"product_id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
"title" VARCHAR(255),
"price" NUMERIC(10, 2),
"image" VARCHAR(255),
"description" VARCHAR,
"category" VARCHAR(128)
);
`)

  insertProductTable(data)
}

export function insertProductTable(data: TableProduct[]) {
  data.forEach(async (item) => {
    const { title, price, image, description, category } = item

    await pool.query(
`
INSERT INTO "product" (title, price, image, description, category)
VALUES ($1, $2, $3, $4, $5) RETURNING *
`,
[title, price, image, description, category],
    )
  })
}

export async function dropProductTable() {
  await pool.query('DROP TABLE "product"')
}

export async function getAllProducts() {
  const data = await pool.query<TableProduct>(`
SELECT *
FROM "product"
`)

  // Мутируем ключ `price` для простого использования данных
  data.rows.forEach(item => (item.price = Number(item.price)))

  return data.rows
}

export async function getProduct(product_id: number) {
  const data = await pool.query<TableProduct>(
`
SELECT *
FROM "product" WHERE "product_id" = $1
`,
[product_id],
  )

  if (!data.rows[0])
    return null

  // Мутируем ключ `price` для простого использования данных
  data.rows[0].price = Number(data.rows[0].price)

  return data.rows[0]
}
