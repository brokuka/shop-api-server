import type { NextFunction, Router } from 'express'
import verifyJWT from '../middleware/verifyJWT.js'
import {
  cart,
  deleteCartItem,
  getCart,
  updateCart,
} from '../controllers/cart.js'
import verifySession from '../middleware/verifySession.js'

export default (router: Router) => {
  /**
   * @openapi
   * '/api/cart':
   *  get:
   *   description: |
   *    ### ```Обязательно: Требуется авторизация!```
   *   tags:
   *    - Cart
   *   responses:
   *     200:
   *      content:
   *       application/json:
   *        schema:
   *         $ref: '#/components/schemas/Cart'
   *      description: OK
   */
  router.get('/cart', verifyJWT, getCart)

  /**
   * @openapi
   * '/api/cart':
   *  post:
   *   description: |
   *    ### ```Обязательно: Требуется авторизация и токен сессии!```
   *   tags:
   *    - Cart
   *   security:
   *    - bearerAuth: []
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/components/schemas/CartRequestBody'
   *   responses:
   *     200:
   *      content:
   *       application/json:
   *        schema:
   *         $ref: '#/components/schemas/MessageAndNullData'
   *      description: OK
   */
  router.post('/cart', verifySession, verifyJWT, cart)

  /**
   * @openapi
   * '/api/cart/update':
   *  post:
   *   description: |
   *    ### ```Обязательно: Требуется авторизация и токен сессии!```
   *   tags:
   *    - Cart
   *   security:
   *    - bearerAuth: []
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/components/schemas/CartRequestBody'
   *   responses:
   *     200:
   *      content:
   *       application/json:
   *        schema:
   *         $ref: '#/components/schemas/UpdatedCartItem'
   *      description: OK
   */
  router.post('/cart/update', verifySession, verifyJWT, updateCart)

  /**
   * @openapi
   * '/api/cart/:product_id':
   *  delete:
   *   description: |
   *    ### ```Обязательно: Требуется авторизация и токен сессии!```
   *   tags:
   *    - Cart
   *   security:
   *    - bearerAuth: []
   *   parameters:
   *    - name: product_id
   *      in: path
   *      required: true
   *      schema:
   *       type: string
   *   responses:
   *     200:
   *      content:
   *       application/json:
   *        schema:
   *         $ref: '#/components/schemas/Cart'
   *      description: OK
   */
  router.delete('/cart/:product_id', verifySession, verifyJWT, deleteCartItem)
}
