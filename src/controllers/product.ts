import { customResponse, errorResponse } from "../utils/common.js";
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

      return customResponse(res, { data: allProduct });
    }

    const product = await getProduct(product_id);

    if (!product) {
      return errorResponse(res, {
        type: "NOT_FOUND",
        message: "INVALID_PRODUCT",
      });
    }

    customResponse(res, { data: { ...product } });
  } catch (error) {
    console.log(error);
  }
};
