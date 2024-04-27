import type { NextFunction, Router } from 'express'
import verifyJWT from '../middleware/verifyJWT.js'
import {
  login,
  logout,
  refresh,
  register,
} from '../controllers/authentication.js'
import verifySession from '../middleware/verifySession.js'

export default (router: Router) => {
  /**
   * @openapi
   * '/api/auth/register':
   *  post:
   *   tags:
   *    - Authorization
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/components/schemas/BaseCredentials'
   *   responses:
   *    200:
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/MessageAndNullData'
   *     description: OK
   */
  router.post('/auth/register', register)

  /**
   * @openapi
   * '/api/auth/login':
   *  post:
   *   tags:
   *    - Authorization
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/components/schemas/BaseCredentials'
   *   responses:
   *    200:
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/LoginResponse'
   *     description: OK
   *    403:
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/MessageAndNullData'
   *     description: FORBIDDEN
   */
  router.post('/auth/login', login)

  /**
   * @openapi
   * '/api/auth/refresh':
   *  post:
   *   description: |
   *    ### ```Обязательно: Требуется токен сессии!```
   *   tags:
   *    - Authorization
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
  router.post('/auth/refresh', verifySession, refresh)

  /**
   * @openapi
   * '/api/auth/logout':
   *  post:
   *   description: |
   *    ### ```Обязательно: Требуется токен сессии!```
   *   tags:
   *    - Authorization
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
  router.post('/auth/logout', verifySession, logout)
}
