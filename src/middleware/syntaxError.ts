import type { NextFunction, Response } from 'express'
import { badRequest } from '../utils/common.js'

export function synaxError(err: any, req: any, res: Response, next: NextFunction) {
  if (err instanceof SyntaxError && 'body' in err)
    return badRequest(res)

  next()
}
