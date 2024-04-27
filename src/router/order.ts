import type { NextFunction, Router } from 'express'
import verifyJWT from '../middleware/verifyJWT.js'
import { getOrder, getOrders, order } from '../controllers/order.js'
import verifySession from '../middleware/verifySession.js'

export default (router: Router) => {
  /**
   * @openapi
   * '/api/order':
   *  get:
   *   description: |
   *    ### ```Обязательно: Требуется авторизация!```
   *   tags:
   *    - Order
   *   responses:
   *     200:
   *      content:
   *       application/json:
   *        schema:
   *         $ref: '#/components/schemas/Order'
   *      description: OK
   */
  router.get('/order', verifyJWT, getOrders)

  /**
   * @openapi
   * '/api/order':
   *  post:
   *   description: |
   *    ### ```Обязательно: Требуется авторизация и токен сессии!```
   *   tags:
   *    - Order
   *   security:
   *    - bearerAuth: []
   *   responses:
   *     200:
   *      content:
   *       application/json:
   *        schema:
   *         $ref: '#/components/schemas/MessageAndNullData'
   *      description: OK
   */
  router.post('/order', verifySession, verifyJWT, order)

  /**
   * @openapi
   * '/api/order/:order_id':
   *  post:
   *   description: |
   *    ### ```Обязательно: Требуется авторизация и токен сессии!```
   *   tags:
   *    - Order
   *   security:
   *    - bearerAuth: []
   *   parameters:
   *    - name: order_id
   *      in: path
   *      required: true
   *      schema:
   *       type: string
   *   responses:
   *     200:
   *      content:
   *       application/json:
   *        schema:
   *         $ref: '#/components/schemas/Order'
   *      description: OK
   */
  router.get('/order/:order_id', verifySession, verifyJWT, getOrder)
}
