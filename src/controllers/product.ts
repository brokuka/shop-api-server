import type { Request, Response } from 'express'
import slugify from 'slug'
import type { PaginationQuery } from '../utils/types.js'
import { customResponse, errorResponse } from '../utils/common.js'
import { getAllProducts, getProduct } from '../db/product.js'

export interface ProductRequestParams {
  productIdOrSlug: string
}

export async function product(req: Request<ProductRequestParams, any, any, Partial<PaginationQuery>>, res: Response) {
  try {
    const { productIdOrSlug } = req.params

    const hasProductIdOrSlug = Boolean(productIdOrSlug)

    if (!hasProductIdOrSlug) {
      const allProduct = await getAllProducts(req.query)

      if (!allProduct)
        return errorResponse(res, 'BAD_PARAMS')

      return customResponse(res, allProduct)
    }

    const isOnlyProductId = Number.isInteger(Number(productIdOrSlug))
    const product_id = Number(productIdOrSlug.match(/\d+$/)?.[0])

    if (Number.isNaN(product_id)) {
      return errorResponse(res, {
        type: 'NOT_FOUND',
        message: 'INVALID_PRODUCT',
      })
    }

    const product = await getProduct(product_id)

    const slug = !isOnlyProductId ? productIdOrSlug.replace(/(-\d+)$/, '') : ''

    if (!product || product && !isOnlyProductId && slug !== slugify(product.title)) {
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
