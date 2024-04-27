import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { swaggerOptions } from './lib/swagger.js'
import { synaxError } from './middleware/syntaxError.js'
import router from './router/index.js'
import { notFound } from './middleware/notFound.js'

/**
 * @openapi
 * components:
 *  schemas:
 *   BaseCredentials:
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *     password:
 *      type: string
 *   MessageAndNullData:
 *    type: object
 *    properties:
 *     data:
 *      type: string
 *      nullable: true
 *     message:
 *      type: string
 *   LoginResponse:
 *    type: object
 *    properties:
 *     data:
 *      type: object
 *      properties:
 *       user_id:
 *        type: number
 *       name:
 *        type: string
 *       surname:
 *        type: string
 *       middlename:
 *        type: string
 *       email:
 *        type: string
 *       group:
 *        type: string
 *       session:
 *        type: string
 *     message:
 *      type: string
 *   Cart:
 *    type: object
 *    properties:
 *     data:
 *      type: object
 *      properties:
 *       cart_id:
 *        type: number
 *       user_id:
 *        type: number
 *       date:
 *        type: string
 *       total_price:
 *        type: number
 *       total_quantity:
 *        type: number
 *       items:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/CartItem'
 *     message:
 *      type: string
 *      nullable: true
 *   CartItem:
 *    allOf:
 *     - $ref: '#/components/schemas/Product'
 *     - type: object
 *       properties:
 *        cart_item_id:
 *         type: number
 *        quantity:
 *         type: number
 *   CartRequestBody:
 *    type: object
 *    properties:
 *     product_id:
 *      type: number
 *     quantity:
 *      type: number
 *   UpdatedCartItem:
 *    type: object
 *    properties:
 *     data:
 *      type: object
 *      properties:
 *       cart_item_id:
 *        type: number
 *       cart_id:
 *        type: number
 *       user_id:
 *        type: number
 *       product_id:
 *        type: number
 *       quantity:
 *        type: number
 *       price:
 *        type: number
 *     message:
 *      type: string
 *      nullable: true
 *   Order:
 *    type: object
 *    properties:
 *     data:
 *      type: object
 *      properties:
 *       order_id:
 *        type: number
 *       user_id:
 *        type: number
 *       total_price:
 *        type: number
 *       total_quantity:
 *        type: number
 *       date:
 *        type: string
 *       items:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/OrderItem'
 *     message:
 *      type: string
 *      nullable: true
 *   OrderItem:
 *    type: object
 *    properties:
 *     order_item_id:
 *      type: number
 *     order_id:
 *      type: number
 *     user_id:
 *      type: number
 *     product:
 *      type: object
 *      $ref: '#/components/schemas/Product'
 *   Products:
 *    type: object
 *    properties:
 *     data:
 *      type: object
 *     message:
 *      type: string
 *      nullable: true
 *   Product:
 *    type: object
 *    properties:
 *     product_id:
 *      type: number
 *     title:
 *      type: string
 *     price:
 *      type: number
 *     image:
 *      type: string
 *     description:
 *      type: string
 *     category:
 *      type: string
 */

const app = express()

const swaggerSpec = swaggerJSDoc(swaggerOptions)

const origin = ['http://localhost:3000', 'https://shop-api.online']

app.use(cors({ credentials: true, origin }))
app.use(cookieParser())
app.use(express.json())

app.use('/api', router())
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCssUrl: '../public/swagger-ui.min.css', customJs: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.min.js' }))
app.use('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.use(notFound)
app.use(synaxError)

export default app
