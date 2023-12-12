import app from "app.js";
import axios from "axios";
import { createCartTable, isCartTableExist } from "./db/cart.js";
import { createCartItemTable, isCartItemTableExist } from "./db/cart_item.js";
import { createOrderTable, isOrderTableExist } from "./db/order.js";
import {
  createOrderItemTable,
  isOrderItemTableExist,
} from "./db/order_item.js";
import {
  TableProduct,
  createProductTable,
  isProductTableExist,
} from "./db/product.js";
import { createTokenTable, isTokenTableExist } from "./db/token.js";
import { createUserTable, isUserTableExist } from "./db/user.js";
import { Product } from "./utils/schemas.js";
import config from "./config.js";

app.listen(config.SERVER_PORT, async () => {
  console.log(`Listening: http://localhost:${config.SERVER_PORT}`);

  // Получаем мок данные и обрабатываем их и
  // Создаём таблицы если их нет в базе данных
  if (!isProductTableExist) {
    const { data } = await axios.get("https://fakestoreapi.com/products", {
      transformResponse: (res) => {
        const deserializedData = JSON.parse(res) as Product[];

        return deserializedData.map((product): TableProduct => {
          const { rating, id, ...etc } = product;

          return { ...etc, product_id: id };
        });
      },
    });

    await createProductTable(data);
  }

  if (!isUserTableExist) {
    await createUserTable();
  }

  if (!isTokenTableExist) {
    await createTokenTable();
  }

  if (!isCartTableExist) {
    await createCartTable();
  }

  if (!isCartItemTableExist) {
    await createCartItemTable();
  }

  if (!isOrderTableExist) {
    await createOrderTable();
  }

  if (!isOrderItemTableExist) {
    await createOrderItemTable();
  }
});
