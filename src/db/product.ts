import type { Pagination, PaginationQuery, ResponseOptions } from 'utils/types.js'
import { RESPONSE_DATA_LIMIT } from 'utils/constants.js'
import { errorResponse, getPagination } from 'utils/common.js'
import type { Product } from '../utils/schemas.js'
import { pool } from './index.js'

interface DefaultProductData {
  data: TableProduct[]
  pagination?: Pagination
}

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

export async function getAllProducts(pagination: Partial<PaginationQuery>) {
  const { total, limit, orderBy, error, offset } = await getPagination(pagination, 'product')

  console.log('@error', error)

  if (error)
    return null

  const data = await pool.query<TableProduct>(`
SELECT *
FROM "product" ${orderBy} LIMIT $1 OFFSET $2
`, [limit, offset])

  // Мутируем ключ `price` для простого использования данных
  data.rows.forEach(item => (item.price = Number(item.price)))

  console.log('@error', error)

  return <DefaultProductData>{
    data: data.rows,
    pagination: {
      rows: data.rowCount,
      total,
      offset,
    },
  }
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
