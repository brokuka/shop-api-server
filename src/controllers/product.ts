import type { Request, Response } from 'express'
import type { PaginationQuery } from 'utils/types.js'
import { badRequest, customResponse, errorResponse } from '../utils/common.js'
import { getAllProducts, getProduct } from '../db/product.js'

export interface ProductRequestParams {
  product_id: number
}

export async function product(req: Request<ProductRequestParams, any, any, Partial<PaginationQuery>>, res: Response) {
  try {
    const { product_id } = req.params

    const hasProductId = Boolean(product_id)

    if (!hasProductId) {
      const allProduct = await getAllProducts(req.query)

      if (!allProduct)
        return errorResponse(res, 'BAD_PARAMS')

      return customResponse(res, allProduct)
    }

    const product = await getProduct(product_id)

    if (!product) {
      return errorResponse(res, {
        type: 'NOT_FOUND',
        message: 'INVALID_PRODUCT',
      })
    }

    customResponse(res, { data: { ...product } })
  }
  catch (error) {
    console.log(error)
  }
}
