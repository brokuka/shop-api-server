import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config.js'
import { errorResponse } from '../utils/common.js'

export default function verifySession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader
      = req.headers.authorization || (req.headers.Authorization as string)

    if (!authHeader)
      return errorResponse(res, 'UNAUTHORIZED')

    const session = authHeader.split(' ')[1]

    jwt.verify(session, config.SECRET_SESSION_TOKEN, (error: any) => {
      if (error)
        return errorResponse(res, 'FORBIDDEN')
    })

    const decoded = jwt.decode(session) as { user_id: number }

    req.user_id = decoded.user_id

    next()
  }
  catch (error) {
    console.log(error)
  }
}
