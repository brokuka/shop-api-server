import { Router } from 'express'
import authentication from './authentication.js'
import user from './user.js'
import product from './product.js'
import cart from './cart.js'
import order from './order.js'

const router = Router()

export default () => {
  authentication(router)
  product(router)
  user(router)
  cart(router)
  order(router)

  return router
}
