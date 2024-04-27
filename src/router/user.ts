import type { NextFunction, Router } from 'express'
import verifyJWT from '../middleware/verifyJWT.js'
import { updateUserData, user } from '../controllers/user.js'
import verifySession from '../middleware/verifySession.js'

function routeTag(req: any, res: any, next: NextFunction) {
  // #swagger.tags = ['Product']

  next()
}

export default (router: Router) => {
  router.get('/user', routeTag, verifyJWT, user)
  router.patch('/user', routeTag, verifySession, verifyJWT, updateUserData)
}
