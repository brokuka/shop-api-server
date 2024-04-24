import type { Response } from 'express'
import type { CUSTOM_MESSAGE, ERROR } from './constants.js'

export interface Pagination {
  rows: number
  total: number
}

export type Messages = ErrorMessageKeys | CustomMessageKeys

export type CustomResponse = Parameters<
  (
    response: Response,
    optionsOrMessage: Partial<ResponseOptions> | CustomMessageKeys
  ) => Response
>

export type CustomMessageKeys = Keys<typeof CUSTOM_MESSAGE>

export interface ResponseOptions<T = Nullable<any>> {
  status: number
  data: T
  message: CustomMessageKeys
  pagination: Pagination
}

export type ErrorMessageKeys = Keys<typeof ERROR>
interface ErrorOptions {
  type: keyof typeof ERROR
  message: Messages
}

export type ErrorResponse = Parameters<
  (
    response: Response,
    optionsOrType: Optional<ErrorOptions, 'message'> | Messages
  ) => Response
>

export interface PaginationQuery {
  limit: string
  page: string
  orderBy: 'desc' | 'asc'
}
