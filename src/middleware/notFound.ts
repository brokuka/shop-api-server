import type { NextFunction, Request, Response } from 'express'
import { customResponse, errorResponse } from 'utils/common.js'

export function notFound(req: Request, res: Response, next: NextFunction) {
  if (req.path === '/')
    return customResponse(res, 'WELCOME_MESSAGE')

  errorResponse(res, 'NOT_FOUND')
  next()
}
