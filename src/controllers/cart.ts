import { Response, Request } from "express";
import {
  deleteCartItemByProductId,
  getCartItemsByCartId,
  insertCartItemTable,
  updateCartItemByProductId,
} from "../db/cart_item.js";
import {
  getCartByUserId,
  insertCartTable,
  updateCartTable,
} from "../db/cart.js";
import { getProduct } from "../db/product.js";
import { isObjectEmpty } from "../utils/common.js";

type RequestBody = {
  product_id: number;
  quantity: number;
};

export const cart = async (req: Request, res: Response) => {
  try {
    const body = req.body as RequestBody;

    if (isObjectEmpty(body) || !body.product_id || !body.quantity) {
      return res.status(400).json({ message: "Ошибка в теле запроса" });
    }

    const existingProduct = await getProduct(body.product_id);

    if (!existingProduct) {
      return res.status(400).json({ message: "Ошибка в теле запроса" });
    }

    const existingCart = await getCartByUserId(req.user_id);

    if (!existingCart) {
      const newCart = await insertCartTable({
        user_id: req.user_id,
        total_price: existingProduct.price * body.quantity,
        total_quantity: body.quantity,
      });

      await insertCartItemTable({
        ...body,
        user_id: req.user_id,
        cart_id: newCart.cart_id,
        price: existingProduct.price * body.quantity,
      });

      return res.json({ message: "Товар добавлен в корзину" });
    }

    const existingCartItem = await insertCartItemTable({
      ...body,
      user_id: req.user_id,
      cart_id: existingCart.cart_id,
      price: existingProduct.price * body.quantity,
    });

    await updateCartTable({
      cart_id: existingCart.cart_id,
      total_price: existingCartItem.price + existingCart.total_price,
      total_quantity: existingCartItem.quantity + existingCart.total_quantity,
    });

    res.json({ message: "Корзина обновлена" });
  } catch (error) {
    console.log(error);
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const existingCart = await getCartByUserId(req.user_id);

    if (!existingCart) {
      return res.json({ message: "Корзина пуста" });
    }

    const cartItems = await getCartItemsByCartId(existingCart.cart_id);
    const formatedCartItems = await Promise.all(
      cartItems.map(async ({ cart_id, user_id, product_id, ...etc }) => {
        const product = await getProduct(product_id);

        return { ...etc, ...product };
      })
    );

    const data = {
      ...existingCart,
      items: formatedCartItems,
    };

    return res.json(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateCart = async (req: Request, res: Response) => {
  try {
    const body = req.body as RequestBody;

    if (
      isObjectEmpty(body) ||
      !body.product_id ||
      !body.quantity ||
      body.quantity < 1
    ) {
      return res.status(400).json({ message: "Ошибка в теле запроса" });
    }

    const existingCart = await getCartByUserId(req.user_id);

    if (!existingCart) {
      return res.json({ message: "Корзина пуста" });
    }

    const existingProduct = await getProduct(body.product_id);

    if (!existingProduct) {
      return res.status(400).json({ message: "Ошибка в теле запроса" });
    }

    const updatedItem = await updateCartItemByProductId(
      body.product_id,
      body.quantity
    );

    if (!updatedItem) {
      return res.status(400).json({ message: "Ошибка в теле запроса" });
    }

    await updateCartTable({
      cart_id: existingCart.cart_id,
      total_price:
        existingCart.total_price + existingProduct.price * updatedItem.quantity,
      total_quantity: existingCart.total_quantity + updatedItem.quantity,
    });

    res.json({ message: "Обновлено" });
  } catch (error) {
    console.log(error);
  }
};

type DeleteCartItem = {
  product_id: string;
};

export const deleteCartItem = async (
  req: Request<DeleteCartItem>,
  res: Response
) => {
  try {
    const product_id = Number(req.params.product_id);

    if (!product_id) {
      return res.status(400).json({ message: "Ошибка в параметрах запроса" });
    }

    const existingCart = await getCartByUserId(req.user_id);

    if (!existingCart) {
      return res.json({ message: "Корзина пуста" });
    }

    const existingProduct = await getProduct(product_id);

    if (!existingProduct) {
      return res.status(400).json({ message: "Ошибка в параметрах запроса" });
    }

    const deletedItem = await deleteCartItemByProductId(product_id);

    if (!deletedItem) {
      return res.status(400).json({ message: "Ошибка в параметрах запроса" });
    }

    await updateCartTable({
      cart_id: existingCart.cart_id,
      total_price:
        existingCart.total_price - existingProduct.price * deletedItem.quantity,
      total_quantity: existingCart.total_quantity - deletedItem.quantity,
    });

    res.json({ message: "Продукт успешно удалён из корзины" });
  } catch (error) {
    console.log(error);
  }
};
