import type { Router } from 'express'
import { product } from '../controllers/product.js'

export default (router: Router) => {
  router.get('/product/:product_id', product)
  router.get('/product', product)
}
