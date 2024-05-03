import slugify from 'slug'
import type { Pagination, PaginationQuery } from '../utils/types.js'
import { getPagination } from '../utils/common.js'
import type { Product } from '../utils/schemas.js'
import { pool } from './index.js'

interface Slug {
  slug: string
}

interface DefaultProductData {
  data: (TableProduct & Slug)[]
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

  if (error)
    return null

  const data = await pool.query<TableProduct>(`
SELECT *
FROM "product" ${orderBy} LIMIT $1 OFFSET $2
`, [limit, offset])

  // Мутируем ключ `price` для простого использования данных
  const newData = data.rows.map(product => ({
    ...product,
    price: Number(product.price),
    slug: `${slugify(product.title)}-${product.product_id}`,
  }))

  return <DefaultProductData>{
    data: newData,
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

  const product = data.rows[0]

  if (!product)
    return null

  return {
    ...product,
    // Мутируем ключ `price` для простого использования данных
    price: Number(product.price),
    slug: `${slugify(product.title)}-${product.product_id}`,
  }
}
