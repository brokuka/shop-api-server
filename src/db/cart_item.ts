import { pool } from "./index.js";

export type CartItem = {
  cart_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: number;
};

export type TableCartItem = {
  cart_item_id: number;
} & CartItem;

const cartItemTable = await pool.query(
  `SELECT to_regclass('public.cart_item');`
);
export const isCartItemTableExist = Boolean(
  cartItemTable.rows[0]["to_regclass"]
);

export const createCartItemTable = async () => {
  await pool.query(`
	CREATE TABLE "cart_item"
	(
		"cart_item_id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
		"cart_id" INTEGER REFERENCES "cart"(cart_id) ON DELETE CASCADE,
		"user_id" INTEGER REFERENCES "user"(user_id),
		"product_id" INTEGER REFERENCES "product"(product_id),
		"quantity" INTEGER,
		"price" NUMERIC(10, 2)
	);
`);
};

export const insertCartItemTable = async (cart_item: CartItem) => {
  const { quantity, product_id, user_id, cart_id, price } = cart_item;

  const data = await pool.query<TableCartItem>(
    `
		INSERT INTO "cart_item" (product_id, quantity, user_id, cart_id, price)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
	`,
    [product_id, quantity, user_id, cart_id, price]
  );

  const formatedData: TableCartItem = {
    ...data.rows[0],
    price: Number(data.rows[0].price),
  };

  return formatedData;
};

export const dropCartItemTable = async () => {
  await pool.query('DROP TABLE "cart_item"');
};

export const getCartItemByUserId = async (user_id: number) => {
  const data = await pool.query<TableCartItem>(
    `
		SELECT *
		FROM "cart_item" WHERE "user_id" = $1
	`,
    [user_id]
  );

  return data.rows;
};

export const getCartItemByProductId = async (product_id: number) => {
  try {
    const data = await pool.query<TableCartItem>(
      `
		SELECT *
		FROM "cart_item" WHERE "product_id" = $1
	`,
      [product_id]
    );

    if (!data.rows[0]) {
      throw new Error("Продукт не найден в корзине");
    }

    const formatedData: TableCartItem = {
      ...data.rows[0],
      price: Number(data.rows[0].price),
    };

    return formatedData;
  } catch (error) {
    return null;
  }
};

export const getCartItemsByCartId = async (cart_id: number) => {
  const data = await pool.query<TableCartItem>(
    `
		SELECT *
		FROM "cart_item" WHERE "cart_id" = $1
	`,
    [cart_id]
  );

  const formatedCartItems = [] as TableCartItem[];
  data.rows.forEach((item) => {
    formatedCartItems.push({ ...item, price: Number(item.price) });
  });

  return formatedCartItems;
};

/**
 *
 * @param type -
 * 			`change` - заменяет, `update` - обновляет продукт в корзине
 */
export const editCartItemByProductId = async (
  product_id: number,
  quantity: number,
  type: "change" | "update" = "update"
) => {
  const data = await pool.query<TableCartItem>(
    `
		UPDATE "cart_item"
		SET ${
      type === "update"
        ? "quantity = quantity + $1, price = price * (quantity + $1) / quantity"
        : "quantity = $1::integer, price = price * $1 / quantity"
    }
		WHERE "product_id" = $2
		RETURNING *
	`,
    [quantity, product_id]
  );

  const formatedData: TableCartItem = {
    ...data.rows[0],
    price: Number(data.rows[0].price),
  };

  return formatedData;
};

export const deleteCartItemByProductId = async (product_id: number) => {
  try {
    const data = await pool.query<TableCartItem>(
      `DELETE FROM "cart_item" WHERE "product_id" = $1
				RETURNING *
			`,
      [product_id]
    );

    return data.rows[0];
  } catch (error) {
    console.log(error);
  }
};
