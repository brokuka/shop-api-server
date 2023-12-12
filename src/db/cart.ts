import { pool } from "./index.js";

export type TableCart = {
  cart_id: number;
  user_id: number;
  total_price: number;
  total_quantity: number;
};

const cartTable = await pool.query(`SELECT to_regclass('public.cart');`);
export const isCartTableExist = Boolean(cartTable.rows[0]["to_regclass"]);

export const createCartTable = async () => {
  await pool.query(`
	CREATE TABLE "cart"
	(
		"cart_id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
		"user_id" INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE,
		"date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		"total_price" NUMERIC(10, 2) DEFAULT 0,
		"total_quantity" INTEGER DEFAULT 0
	);
`);
};

type InsertCart = Omit<TableCart, "cart_id">;
export const insertCartTable = async (cart: InsertCart) => {
  const { total_price, total_quantity, user_id } = cart;

  const data = await pool.query<TableCart>(
    `
		INSERT INTO "cart" (user_id, total_quantity, total_price)
		VALUES ($1, $2, $3)
		RETURNING *
	`,
    [user_id, total_quantity, total_price]
  );

  const formatedData: TableCart = {
    ...data.rows[0],
    total_price: Number(data.rows[0].total_price),
  };

  return formatedData;
};

type UpdateCart = Omit<TableCart, "user_id">;
export const updateCartTable = async (cart: UpdateCart) => {
  const { total_price, total_quantity, cart_id } = cart;

  const data = await pool.query<TableCart>(
    `
		UPDATE "cart" SET total_price = ($1), total_quantity = ($2)
		WHERE cart_id = ($3)
		RETURNING *
	`,
    [total_price, total_quantity, cart_id]
  );

  return data.rows[0];
};

export const dropCartTable = async () => {
  await pool.query('DROP TABLE "cart" CASCADE');
};

export const clearCartTable = async (user_id: number) => {
  await pool.query('DELETE FROM "cart" where "user_id" = $1', [user_id]);
};

export const getCartByUserId = async (user_id: number) => {
  try {
    const data = await pool.query<TableCart>(
      `
		SELECT *
		FROM "cart" WHERE "user_id" = $1
	`,
      [user_id]
    );

    const formatedData: TableCart = {
      ...data.rows[0],
      total_price: Number(data.rows[0].total_price),
    };

    return formatedData;
  } catch (error) {
    return null;
  }
};
