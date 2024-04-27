import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { swaggerCssUrl, swaggerOptions } from './lib/swagger.js'
import { synaxError } from './middleware/syntaxError.js'
import router from './router/index.js'
import { notFound } from './middleware/notFound.js'

const app = express()
const swaggerSpec = swaggerJSDoc(swaggerOptions)

const origin = ['http://localhost:3000', 'https://shop-api.online']

app.use(cors({ credentials: true, origin }))
app.use(cookieParser())
app.use(express.json())

app.use('/api', router())
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCssUrl: swaggerCssUrl }))
app.use('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.use(notFound)
app.use(synaxError)

export default app
