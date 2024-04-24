import type { Response } from 'express'
import { CUSTOM_MESSAGE, ERROR, SUCCESS_STATUS_CODE } from './constants.js'
import type {
  CustomMessageKeys,
  CustomResponse,
  ErrorMessageKeys,
  ErrorResponse,
  Messages,
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

  const { data, message, status = SUCCESS_STATUS_CODE } = args[1]

  return response
    .status(status)
    .json({ data, message: message ? CUSTOM_MESSAGE[message] : null })
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
