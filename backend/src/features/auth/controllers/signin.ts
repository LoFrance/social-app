import { Request, Response } from 'express'
import { joiMethodValidation } from '@lfapp/shared-globals-decorators/src/joi-validation'
import HTTP_STATUS from 'http-status-codes'
import { authService } from '@services/db/auth'
import { BadRequestError } from '@lfapp/shared-globals-handlers'
import { signinInSchema } from '@auth/schemes/signin'
import { IAuthDocument, IAuthPayload } from '@auth/interfaces/auth'
import { signupToken } from '@root/shared/jwt'
import { ObjectId } from 'mongodb'
import { userService } from '@services/db/user'
import { IUserDocument } from '@user/interfaces/user'

const read = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body
  await joiMethodValidation(signinInSchema)(req)

  const existingUser: IAuthDocument | null = await authService().getAuthUserByUsername(username)
  if (!existingUser) {
    throw BadRequestError('Invalid credentials - Check username')
  }

  const passwordsMatch: boolean = await existingUser.comparePassword(password)
  if (!passwordsMatch) {
    throw BadRequestError('Invalid credentials - Check password')
  }

  const user: IUserDocument = await userService().getUserByAuthId(existingUser._id as string)

  const userJwt: string = signupToken<IAuthPayload>(
    {
      userId: user._id as string,
      ...existingUser,
    },
    existingUser._id as ObjectId
  )

  req.session = { jwt: userJwt }

  const userDocument: IUserDocument = {
    ...user,
    authId: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    avatarColor: existingUser.avatarColor,
    uId: existingUser.uId,
    createdAt: existingUser.createdAt,
  } as IUserDocument
  res.status(HTTP_STATUS.OK).json({
    message: 'User login succesfully',
    user: userDocument,
    token: userJwt,
  })
}

export const signIn = () => {
  return {
    read: read,
  }
}
