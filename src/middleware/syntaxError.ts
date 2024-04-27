import type { NextFunction, Request, Response } from 'express'
import { badRequest, errorResponse } from 'utils/common.js'

export function synaxError(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof SyntaxError && 'body' in err)
    return badRequest(res)

  next()
}
