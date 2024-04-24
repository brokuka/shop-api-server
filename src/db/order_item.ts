import type { TableCartItem } from './cart_item.js'
import { pool } from './index.js'

export interface OrderItem {
  quantity: number
  product_id: number
  price: number
}

export interface TableOrderItem {
  order_item_id: number
  order_id: number
  user_id: number
  product_id: number
  quantity: number
  price: number
}

const orderItemTable = await pool.query(
`SELECT to_regclass('public.order_item');`,
)
export const isOrderItemTableExist = Boolean(
  orderItemTable.rows[0].to_regclass,
)

export async function createOrderItemTable() {
  await pool.query(`
CREATE TABLE "order_item"
(
"order_item_id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
"order_id" INTEGER REFERENCES "order"(order_id) ON DELETE CASCADE,
"user_id" INTEGER REFERENCES "user"(user_id),
"product_id" INTEGER REFERENCES "product"(product_id),
"quantity" INTEGER NOT NULL,
"price" NUMERIC(10, 2) NOT NULL
);
`)
}

export async function insertOrderItemsTable(order_id: number, cart_items: TableCartItem[]) {
  cart_items.forEach(async ({ user_id, product_id, quantity, price }) => {
    await pool.query<TableOrderItem>(
`
INSERT INTO "order_item" (order_id, user_id, product_id, quantity, price)
VALUES ($1, $2, $3, $4, $5)
RETURNING *
`,
[order_id, user_id, product_id, quantity, price],
    )
  })
}

export async function dropOrderItemTable() {
  await pool.query('DROP TABLE "order_item"')
}

export async function getOrderItems() {
  const data = await pool.query<TableOrderItem>(`
SELECT * FROM "order_item"
`)

  const formatedOrderItems = [] as TableOrderItem[]
  data.rows.forEach((item) => {
    formatedOrderItems.push({ ...item, price: Number(item.price) })
  })

  return formatedOrderItems
}

export async function getOrderItemsByOrderId(order_id: number) {
  const data = await pool.query<TableOrderItem>(
`
SELECT * FROM "order_item"
WHERE "order_id" = $1
`,
[order_id],
  )

  const formatedOrderItems = [] as TableOrderItem[]
  data.rows.forEach((item) => {
    formatedOrderItems.push({ ...item, price: Number(item.price) })
  })

  return formatedOrderItems
}
