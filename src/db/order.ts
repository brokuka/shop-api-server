import { pool } from './index.js'

export interface Order {
  user_id: number
  total_price: number
  total_quantity: number
}

export type TableOrder = {
  order_id: number
  date: string
} & Order

const orderTable = await pool.query(`SELECT to_regclass('public.order');`)
export const isOrderTableExist = Boolean(orderTable.rows[0].to_regclass)

export async function createOrderTable() {
  await pool.query(`
CREATE TABLE "order"
(
"order_id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
"user_id" INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE,
"total_price" NUMERIC(10, 2),
"total_quantity" INTEGER,
"date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`)
}

export async function insertOrderTable(order: Order) {
  const { user_id, total_price, total_quantity } = order

  const data = await pool.query<TableOrder>(
`
INSERT INTO "order" (user_id, total_price, total_quantity)
VALUES ($1, $2, $3)
RETURNING *
`,
[user_id, total_price, total_quantity],
  )

  const formatedOrder = {
    ...data.rows[0],
    total_price: Number(data.rows[0].total_price),
  }

  return formatedOrder
}

export async function dropOrderTable() {
  await pool.query('DROP TABLE "order"')
}

export async function getOrderById(order_id: number) {
  try {
    const data = await pool.query<TableOrder>(
`
SELECT * FROM "order" WHERE "order_id" = $1
`,
[order_id],
    )

    const formatedOrder = {
      ...data.rows[0],
      total_price: Number(data.rows[0].total_price),
    }

    return formatedOrder
  }
  catch (error) {
    return null
  }
}

export async function getOrderByUserId(user_id: number, order_id: number) {
  try {
    const data = await pool.query<TableOrder>(
`
SELECT *
FROM "order" WHERE "user_id" = ($1) and "order_id" = ($2)
`,
[user_id, order_id],
    )

    if (!data.rows[0])
      throw new Error('У пользователя нет такого заказа')

    const formatedOrder: TableOrder = {
      ...data.rows[0],
      total_price: Number(data.rows[0].total_price),
    }

    return formatedOrder
  }
  catch (error) {}
}

export async function getOrdersByUserId(user_id: number) {
  try {
    const data = await pool.query<TableOrder>(
`
SELECT *
FROM "order" WHERE "user_id" = $1
`,
[user_id],
    )

    if (!data.rowCount)
      throw new Error('Пользователь не имеет заказов')

    const formatedOrders = [] as TableOrder[]
    data.rows.forEach((order) => {
      formatedOrders.push({ ...order, total_price: Number(order.total_price) })
    })

    return formatedOrders
  }
  catch (error) {
    return null
  }
}
