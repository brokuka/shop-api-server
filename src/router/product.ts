import type { Router } from 'express'
import { product } from '../controllers/product.js'

export default (router: Router) => {
  /**
   * @openapi
   * '/api/product':
   *  get:
   *   summary: Получить все продукты
   *   tags:
   *    - Product
   *   responses:
   *     200:
   *      content:
   *       application/json:
   *        schema:
   *         type: object
   *         properties:
   *          data:
   *           type: array
   *           items:
   *            $ref: '#/components/schemas/Product'
   *          message:
   *           type: string
   *           nullable: true
   *      description: OK
   */
  router.get('/product', product)

  /**
   * @openapi
   * '/api/product/:product_id':
   *  get:
   *   summary: Получить продукт
   *   tags:
   *    - Product
   *   responses:
   *     200:
   *      content:
   *       application/json:
   *        schema:
   *         type: object
   *         properties:
   *          data:
   *           $ref: '#/components/schemas/Product'
   *          message:
   *           type: string
   *           nullable: true
   *      description: OK
   */
  router.get('/product/:product_id', product)
}
