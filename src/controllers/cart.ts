import type { Request, Response } from 'express'
import {
  deleteCartItemByProductId,
  editCartItemByProductId,
  getCartItemByProductId,
  getCartItemsByCartId,
  insertCartItemTable,
} from '../db/cart_item.js'
import {
  clearCartTable,
  getCartByUserId,
  insertCartTable,
  updateCartTable,
} from '../db/cart.js'
import { getProduct } from '../db/product.js'
import { badRequest, customResponse, isObjectEmpty } from '../utils/common.js'

interface DefaultBody {
  product_id: number
  quantity: number
}

function bodyValidate(body: DefaultBody) {
  return !isObjectEmpty(body)
    && Boolean(body.product_id && body.quantity >= 1)
}

export async function cart(req: Request<any, any, DefaultBody>, res: Response) {
  try {
    const body = req.body
    const isValidBody = bodyValidate(body)

    if (!isValidBody)
      return badRequest(res)

    const { product_id, quantity } = body

    const existingProduct = await getProduct(product_id)

    if (!existingProduct)
      return badRequest(res)

    let existingCart = await getCartByUserId(req.user_id)

    if (!existingCart) {
      existingCart = await insertCartTable({
        user_id: req.user_id,
        total_price: 0,
        total_quantity: 0,
      })
    }

    const existingCartItem = await getCartItemByProductId(product_id)

    if (!existingCartItem) {
      const newCartItem = await insertCartItemTable({
        product_id,
        quantity,
        user_id: req.user_id,
        cart_id: existingCart.cart_id,
        price: existingProduct.price * quantity,
      })

      await updateCartTable({
        cart_id: existingCart.cart_id,
        total_price: newCartItem.price + existingCart.total_price,
        total_quantity: newCartItem.quantity + existingCart.total_quantity,
      })

      return customResponse(res, { data: newCartItem, message: 'SUCCESS_ADD_TO_CART' })
    }

    const updatedExistingCartItem = await editCartItemByProductId(
      product_id,
      quantity,
    )

    const changedCartItem = await updateCartTable({
      cart_id: existingCart.cart_id,
      total_price:
        existingCart.total_price
        + (updatedExistingCartItem.price - existingCartItem.price),
      total_quantity: existingCart.total_quantity + quantity,
    })

    customResponse(res, { data: changedCartItem, message: 'SUCCESS_REFRESH_CART_ITEM' })
  }
  catch (error) {
    console.log(error)
  }
}

export async function getCart(req: Request, res: Response) {
  try {
    const existingCart = await getCartByUserId(req.user_id)

    if (!existingCart)
      return customResponse(res, 'EMPTY_CART')

    const cartItems = await getCartItemsByCartId(existingCart.cart_id)

    if (!cartItems)
      return customResponse(res, 'INVALID_CART_ID')

    const formatedCartItems = await Promise.all(
      cartItems.map(async ({ cart_id, user_id, product_id, ...etc }) => {
        const product = await getProduct(product_id)

        return { ...product, ...etc }
      }),
    )

    const data = {
      ...existingCart,
      items: formatedCartItems,
    }

    customResponse(res, { data })
  }
  catch (error) {
    console.log(error)
  }
}

export async function updateCart(req: Request<any, any, DefaultBody>, res: Response) {
  try {
    const body = req.body
    const isValidBody = bodyValidate(body)

    if (!isValidBody)
      return badRequest(res)

    const { product_id, quantity } = body

    const existingCart = await getCartByUserId(req.user_id)

    if (!existingCart)
      return customResponse(res, 'EMPTY_CART')

    const existingCartItem = await getCartItemByProductId(product_id)

    if (!existingCartItem)
      return badRequest(res)

    const changedCartItem = await editCartItemByProductId(
      product_id,
      quantity,
      'change',
    )

    const quantityDiff = changedCartItem.quantity - existingCartItem.quantity
    const priceDiff = changedCartItem.price - existingCartItem.price

    existingCart.total_price += priceDiff
    existingCart.total_quantity += quantityDiff

    await updateCartTable({
      cart_id: existingCart.cart_id,
      total_price: existingCart.total_price,
      total_quantity: existingCart.total_quantity,
    })

    customResponse(res, { data: changedCartItem, message: 'SUCCESS_REFRESH_CART_ITEM' })
  }
  catch (error) {
    console.log(error)
  }
}

interface DeleteCartItem {
  product_id?: string
}

export async function deleteCartItem(req: Request<DeleteCartItem>, res: Response) {
  try {
    const product_id = Number(req.params.product_id)

    if (!product_id)
      return badRequest(res, 'BAD_PARAMS')

    const existingCart = await getCartByUserId(req.user_id)

    if (!existingCart)
      return customResponse(res, 'EMPTY_CART')

    const existingCartItem = await getCartItemByProductId(product_id)

    if (!existingCartItem)
      return badRequest(res)

    const deletedItem = await deleteCartItemByProductId(product_id)

    if (!deletedItem)
      return badRequest(res, 'BAD_PARAMS')

    const updatedCart = await updateCartTable({
      cart_id: existingCart.cart_id,
      total_price: existingCart.total_price - deletedItem.price,
      total_quantity: existingCart.total_quantity - deletedItem.quantity,
    })

    if (!updatedCart.total_quantity)
      await clearCartTable(req.user_id)

    customResponse(res, 'SUCCESS_REMOVE_FROM_CART')
  }
  catch (error) {
    console.log(error)
  }
}
