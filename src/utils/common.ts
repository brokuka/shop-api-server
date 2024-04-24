import type { Response } from 'express'
import { pool } from '../db/index.js'
import { CUSTOM_MESSAGE, ERROR, RESPONSE_DATA_LIMIT, SUCCESS_STATUS_CODE } from './constants.js'
import type {
  CustomMessageKeys,
  CustomResponse,
  ErrorMessageKeys,
  ErrorResponse,
  Messages,
  PaginationQuery,
} from './types.js'

export function isObjectEmpty(object: NonNullable<unknown>) {
  return Object.keys(object).length === 0
}

export function customResponse(...args: CustomResponse) {
  const response = args[0]

  if (typeof args[1] === 'string') {
    const message = args[1]

    return response.json({ data: null, message: CUSTOM_MESSAGE[message] })
  }

  const { data, message, status = SUCCESS_STATUS_CODE, pagination } = args[1]

  return response
    .status(status)
    .json({ data, pagination, message: message ? CUSTOM_MESSAGE[message] : null })
}

function getMessageType(type: Messages) {
  const message
= type in ERROR
  ? ERROR[type as ErrorMessageKeys].MESSAGE
  : CUSTOM_MESSAGE[type as CustomMessageKeys]

  return message
}

export function errorResponse(...args: ErrorResponse) {
  const response = args[0]

  if (typeof args[1] === 'string') {
    const type = args[1]
    const message = getMessageType(type)

    return response.json({
      data: null,
      message: message ?? null,
    })
  }

  const { type } = args[1]

  let message
  if (args[1].message)
    message = getMessageType(args[1].message)

  return response
    .status(ERROR[type].CODE)
    .json({ data: null, message: message ?? null })
}

export function badRequest(response: Response, message: Messages = 'BAD_REQUEST') {
  return errorResponse(response, { type: 'BAD_REQUEST', message })
}

export async function getPagination(pagination: Partial<PaginationQuery>, tableName: string) {
  const isValidOrderBy = pagination.orderBy ? (pagination.orderBy.toLowerCase() === 'asc' || pagination.orderBy.toLowerCase() === 'desc') : true

  const page = Math.ceil(pagination.page ? Number.parseInt(pagination.page) : 1)
  const limit = pagination.limit ? Number.parseInt(pagination.limit) : RESPONSE_DATA_LIMIT
  const offset = (page - 1) * limit

  const orderBy = `ORDER BY ${pagination.orderBy ? `"price" ${pagination.orderBy}` : 'product_id'}`

  const dataCount = await pool.query<{ count: string }>(`
SELECT COUNT(*) FROM ${tableName}
	`)

  const total = Number.parseInt(dataCount.rows[0].count)

  const error = !dataCount.rows.length || offset >= total || Number.isNaN(offset) || !Number.isInteger(limit) || !isValidOrderBy

  return {
    limit,
    offset,
    orderBy,
    total,
    error,
  }
}
