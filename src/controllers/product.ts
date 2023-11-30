import { getAllProducts, getProduct } from "../db/product.js";
import { Request, Response } from "express";

export type ProductRequestParams = {
  product_id: number;
};

export const product = async (
  req: Request<ProductRequestParams>,
  res: Response
) => {
  try {
    const { product_id } = req.params;

    const hasProductId = Boolean(product_id);

    if (!hasProductId) {
      const allProduct = await getAllProducts();

      return res.json(allProduct);
    }

    const product = await getProduct(product_id);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Такого продукта нет в базе данных" });
    }

    res.json({ ...product });
  } catch (error) {
    console.log(error);
  }
};
