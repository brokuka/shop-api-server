import type { Request, Response } from 'express'
import { badRequest, customResponse } from '../utils/common.js'
import type { UpdateUserData } from '../db/user.js'
import { getUserById, updateUserTable } from '../db/user.js'

export async function user(req: Request, res: Response) {
  try {
    const user = await getUserById(req.user_id)

    const { password: passwordHash, ...etc } = user

    customResponse(res, { data: { ...etc } })
  }
  catch (error) {
    console.log(error)
  }
}

export async function updateUserData(req: Request, res: Response) {
  try {
    const { middlename, name, surname } = req.body as Omit<
UpdateUserData,
'user_id'
>

    if (!middlename && !name && !surname)
      return badRequest(res)

    const updatedInfo = await updateUserTable({
      middlename,
      name,
      surname,
      user_id: req.user_id,
    })

    const { password, ...etc } = updatedInfo

    customResponse(res, {
      data: { ...etc },
      message: 'SUCCESS_PROFILE_EDIT',
    })
  }
  catch (error) {
    console.log(error)
  }
}
