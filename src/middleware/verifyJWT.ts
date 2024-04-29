import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config, { cookieOptions } from '../config.js'
import { errorResponse } from '../utils/common.js'

export default async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.token

    if (!token)
      return errorResponse(res, 'UNAUTHORIZED')

    jwt.verify(
      token,
      config.SECRET_ACCESS_TOKEN,
      async (error: any, decoded: any) => {
        if (error)
          return errorResponse(res, 'FORBIDDEN')

        if (req.user_id && decoded.user_id !== req.user_id)
          return errorResponse(res, 'FORBIDDEN')

        const { group, user_id } = decoded

        const accessToken = jwt.sign(
          { user_id, group },
          config.SECRET_ACCESS_TOKEN,
          {
            expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME,
          },
        )

        res.cookie('token', accessToken, cookieOptions)

        req.user_id = user_id
        req.group = group

        next()
      },
    )
  }
  catch (error) {
    console.log(error)
  }
}
