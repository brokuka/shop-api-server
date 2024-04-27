import type { Router } from 'express'
import verifyJWT from '../middleware/verifyJWT.js'
import { updateUserData, user } from '../controllers/user.js'
import verifySession from '../middleware/verifySession.js'

export default (router: Router) => {
  /**
   * @openapi
   * '/api/user':
   *  get:
   *   summary: Информация о пользователе
   *   description: |
   *    ### ```Обязательно: Требуется авторизация!```
   *   tags:
   *    - User
   *   responses:
   *     200:
   *      content:
   *       application/json:
   *        schema:
   *         $ref: '#/components/schemas/User'
   *      description: OK
   */
  router.get('/user', verifyJWT, user)

  /**
   * @openapi
   * '/api/user':
   *  patch:
   *   summary: Обновить данные пользователя
   *   description: |
   *    ### ```Обязательно: Требуется авторизация и токен сессии!```
   *   tags:
   *    - User
   *   security:
   *    - bearerAuth: []
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/components/schemas/UserRequestBody'
   */
  router.patch('/user', verifySession, verifyJWT, updateUserData)
}
