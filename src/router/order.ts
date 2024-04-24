import type { Router } from 'express'
import verifyJWT from '../middleware/verifyJWT.js'
import { getOrder, getOrders, order } from '../controllers/order.js'
import verifySession from '../middleware/verifySession.js'

export default (router: Router) => {
  router.post('/order', verifySession, verifyJWT, order)
  router.post('/order/:order_id', verifySession, verifyJWT, getOrder)
  router.get('/order', verifyJWT, getOrders)
}
