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
import { AUTH_SCHEMAS, CART_SCHEMAS, ORDER_SCHEMAS, PRODUCT_SCHEMAS, USER_SCHEMAS, UTIL_SCHEMAS } from './schemas/swagger.js'

const app = express()

const swaggerSpec = swaggerJSDoc(swaggerOptions({
  ...AUTH_SCHEMAS,
  ...CART_SCHEMAS,
  ...ORDER_SCHEMAS,
  ...PRODUCT_SCHEMAS,
  ...USER_SCHEMAS,
  ...UTIL_SCHEMAS,
}))

const origin = ['http://localhost:3000', 'https://shop-api.online']

app.use(cors({ credentials: true, origin }))
app.use(cookieParser())
app.use(express.json())

app.use('/api', router())
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.2/swagger-ui.min.css', customJs: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.2/swagger-ui-bundle.min.js' }))
app.use('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.use(notFound)
app.use(synaxError)

export default app
