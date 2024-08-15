import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { joiMethodValidation } from '@lfapp/shared-globals-decorators/src/joi-validation'
import { signUpSchema } from '@auth/schemes/signup'
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth'
import { authService } from '@root/services/db/auth'
import {
  BadRequestError,
  firstLetterUpperCase,
  generateRandomUUIDs,
  GenericError,
  upload,
} from '@lfapp/shared-globals-handlers'
import { UploadApiResponse } from 'cloudinary'
import HTTP_STATUS from 'http-status-codes'

const signupData = (data: ISignUpData): IAuthDocument => {
  const { _id, username, email, uId, password, avatarColor } = data
  return {
    _id,
    username: firstLetterUpperCase(username),
    email: email.toLocaleLowerCase(),
    uId,
    password,
    avatarColor,
    createdAt: new Date(),
  } as IAuthDocument
}

export const signUp = () => {
  const create = async (req: Request, res: Response): Promise<void> => {
    const { username, password, email, avatarColor, avatarImage } = req.body
    console.log('BEFORE VALIDATION')
    const validation = await joiMethodValidation(signUpSchema)(req)
    console.log(validation)
    const isUserExist: IAuthDocument | null = await authService().getUserByUsernameOrEmail(
      username,
      email
    )
    if (isUserExist) {
      throw BadRequestError('Invalid credentials')
    }

    const authObjectId: ObjectId = new ObjectId()
    const userObjectId: ObjectId = new ObjectId()
    const uId = `${generateRandomUUIDs()}`
    const authData: IAuthDocument = signupData({
      _id: authObjectId,
      uId,
      username,
      email,
      password,
      avatarColor,
    })

    const result = (await upload(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse
    if (!result?.public_id) {
      throw GenericError('File upload: Error occurred.')
    }

    res.status(HTTP_STATUS.CREATED).json({ message: 'User created succesfully!', authData })
  }

  return {
    create,
  }
}
