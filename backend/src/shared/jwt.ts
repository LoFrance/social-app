import { IAuthDocument, IAuthPayload } from '@auth/interfaces/auth'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { getConfig } from '@config/config'

const config = getConfig()

export const signupToken = <T extends IAuthPayload | IAuthDocument>(
  data: T,
  id: ObjectId
): string => {
  return jwt.sign(
    {
      userId: id,
      uId: data.uId,
      email: data.email,
      username: data.username,
      avatarColor: data.avatarColor,
    },
    config.server.JWT_TOKEN
  )
}
