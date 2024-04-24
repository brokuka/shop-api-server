import type { Request, Response } from 'express'
import type { TableCartItem } from '../db/cart_item.js'
import { getCartItemByProductId } from '../db/cart_item.js'
import { clearCartTable, getCartByUserId } from '../db/cart.js'
import type { TableProduct } from '../db/product.js'
import { getProduct } from '../db/product.js'
import {
  badRequest,
  customResponse,
  errorResponse,
  isObjectEmpty,
} from '../utils/common.js'
import type {
  TableOrderItem,
} from '../db/order_item.js'
import {
  getOrderItems,
  getOrderItemsByOrderId,
  insertOrderItemsTable,
} from '../db/order_item.js'
import type {
  TableOrder,
} from '../db/order.js'
import {
  getOrderById,
  getOrderByUserId,
  getOrdersByUserId,
  insertOrderTable,
} from '../db/order.js'

interface DefaultBody {
  products: BodyProduct[]
}

interface BodyProduct {
  product_id: number
  quantity: number
}

export async function order(req: Request<any, any, DefaultBody>, res: Response) {
  try {
    const products = req.body.products

    if (!Array.isArray(products))
      return badRequest(res)

    let isDataValid = false
    const existingCartItems: TableCartItem[] = []

    const previousItem = {} as BodyProduct
    for (const item of products) {
      if (isObjectEmpty(item) || !item.product_id || !item.quantity) {
        isDataValid = false
        break
      }

      if (previousItem.product_id === item.product_id) {
        isDataValid = false
        break
      }

      const existingProduct = await getProduct(item.product_id)

      if (!existingProduct) {
        isDataValid = false
        break
      }

      const existingCartItem = await getCartItemByProductId(item.product_id)

      if (!existingCartItem) {
        isDataValid = false
        break
      }

      if (item.quantity !== existingCartItem.quantity) {
        isDataValid = false
        break
      }

      existingCartItems.push({
        ...existingCartItem,
        price: Number(existingCartItem.price),
      })
      isDataValid = true
    }

    if (!isDataValid)
      return badRequest(res)

    const existingCart = await getCartByUserId(req.user_id)

    if (!existingCart)
      return customResponse(res, 'EMPTY_CART')

    const newOrder = await insertOrderTable({
      total_price: existingCart.total_price,
      total_quantity: existingCart.total_quantity,
      user_id: req.user_id,
    })

    await insertOrderItemsTable(newOrder.order_id, existingCartItems)
    await clearCartTable(req.user_id)

    customResponse(res, 'SUCCESS_ORDER')
  }
  catch (error) {
    console.log(error)
  }
}

interface OrderParam {
  order_id?: string
}

export async function getOrder(req: Request<OrderParam>, res: Response) {
  try {
    const order_id = Number(req.params.order_id)

    if (!order_id)
      return badRequest(res, 'BAD_PARAMS')

    const existingOrder = await getOrderById(order_id)

    if (!existingOrder)
      return badRequest(res, 'BAD_PARAMS')

    const hasUserExactOrder = await getOrderByUserId(req.user_id, order_id)

    if (!hasUserExactOrder)
      return errorResponse(res, 'FORBIDDEN')

    const existingOrderItems = await getOrderItemsByOrderId(
      existingOrder.order_id,
    )

    const formatedProducts = await Promise.all(
      existingOrderItems.map(
        async ({ product_id, price, quantity, ...etc }) => {
          const existingProduct = await getProduct(product_id)

          return { ...etc, product: { ...existingProduct, price, quantity } }
        },
      ),
    )

    const formatedOrder = {
      ...existingOrder,
      items: formatedProducts,
    }

    customResponse(res, { data: formatedOrder })
  }
  catch (error) {
    console.log(error)
  }
}

type FormatedOrderItems = {
  product: {
    quantity: number
  } & TableProduct
} & Omit<TableOrderItem, 'product_id' | 'quantity' | 'price'>

type FormatedOrders = {
  items: FormatedOrderItems[]
} & TableOrder

export async function getOrders(req: Request, res: Response) {
  try {
    const existingOrders = await getOrdersByUserId(req.user_id)

    if (!existingOrders)
      return customResponse(res, 'EMPTY_ORDERS')

    const orderItems = await getOrderItems()

    const formatedProducts = await Promise.all(
      orderItems.map(async ({ product_id, price, quantity, ...etc }) => {
        const existingProduct = await getProduct(product_id)

        return { ...etc, product: { ...existingProduct!, price, quantity } }
      }),
    )

    const formatedOrders = [] as FormatedOrders[]

    if (formatedProducts) {
      existingOrders.forEach((order) => {
        formatedOrders.push({
          ...order,
          items: formatedProducts.filter(f => f.order_id === order.order_id),
        })
      })
    }

    customResponse(res, { data: formatedOrders })
  }
  catch (error) {
    console.log(error)
  }
}
