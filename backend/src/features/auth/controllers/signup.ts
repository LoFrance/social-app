import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { joiMethodValidation } from '@lfapp/shared-globals-decorators/src/joi-validation'
import { signUpSchema } from '@auth/schemes/signup'
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth'
import { authService } from '@root/services/db/auth'
import {
  BadRequestError,
  destroyCloudinaryResource,
  firstLetterUpperCase,
  generateRandomUUIDs,
  GenericError,
  ServerError,
  uploadCloudinaryResource,
} from '@lfapp/shared-globals-handlers'
import { UploadApiResponse } from 'cloudinary'
import HTTP_STATUS from 'http-status-codes'
import { saveUserToRedis } from '@root/services/redis/user'
import { getRedisClient, RedisClient } from '@root/services/redis/client'
import { IUserDocument } from '@user/interfaces/user'
import { getConfigOrThrow } from '@config/config'
import { authQueue } from '@services/queues/auth'
import { userQueue } from '@services/queues/user'
import jwt from 'jsonwebtoken'

const config = getConfigOrThrow()
if (config instanceof Error) {
  throw new Error(config.message)
}

const userData = (data: IAuthDocument, userObjectId: ObjectId): IUserDocument => {
  const { _id, username, email, uId, password, avatarColor } = data
  return {
    _id: userObjectId,
    authId: _id,
    uId,
    username: firstLetterUpperCase(username),
    email,
    password,
    avatarColor,
    profilePicture: '',
    blocked: [],
    blockedBy: [],
    work: '',
    location: '',
    school: '',
    quote: '',
    bgImageVersion: '',
    bgImageId: '',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    notifications: {
      messages: true,
      reactions: true,
      comments: true,
      follows: true,
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
    },
  } as unknown as IUserDocument
}

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

const signupToken = (data: IAuthDocument, userObjectId: ObjectId): string => {
  return jwt.sign(
    {
      userId: userObjectId,
      uId: data.uId,
      email: data.email,
      username: data.username,
      avatarColor: data.avatarColor,
    },
    config.server.JWT_TOKEN
  )
}

export const signUp = () => {
  const create = async (req: Request, res: Response): Promise<void> => {
    const { username, password, email, avatarColor, avatarImage } = req.body

    await joiMethodValidation(signUpSchema)(req)

    const isUserExist: IAuthDocument | null = await authService().getUserByUsernameOrEmail(
      username,
      email
    )
    if (isUserExist) {
      throw BadRequestError('Invalid credentials - User maybe already exists')
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

    // Add Avatar to Cloudinary
    const result = (await uploadCloudinaryResource(
      avatarImage,
      `${userObjectId}`,
      true,
      true
    )) as UploadApiResponse
    if (!result?.public_id) {
      throw GenericError('File upload: Error occurred.')
    }

    // Add to Redis
    try {
      const redicClient: RedisClient = getRedisClient(config.redis.host)
      const userDataForRedis: IUserDocument = userData(authData, userObjectId)
      userDataForRedis.profilePicture = `https://res.cloudinary.com/dyamr9ym3/image/upload/v${result.version}/${userObjectId}`
      await saveUserToRedis(redicClient)(`${userObjectId}`, uId, userDataForRedis)

      // Add to Database
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const omit = (o: any, ...paths: any[]) =>
        Object.fromEntries(Object.entries(o).filter(([k]) => !paths.includes(k)))
      const authJobData = omit(userDataForRedis, [
        'uId',
        'username',
        'email',
        'avatarColor',
        'password',
      ]) as unknown as IUserDocument

      // Passing the Process Job Name and the Value
      authQueue().addAuthJob('addAuthUserToDB', { value: authJobData })
      userQueue().addUserJob('addUserToDB', { value: authJobData })

      const userJwt: string = signupToken(authData, userObjectId)
      req.session = { jwt: userJwt }

      res.status(HTTP_STATUS.CREATED).json({
        message: 'User created succesfully!',
        data: {
          user: userDataForRedis,
          token: userJwt,
        },
      })
    } catch (e) {
      const destroy = (await destroyCloudinaryResource(`${userObjectId}`)) as UploadApiResponse
      console.log(`Destroy ${JSON.stringify(destroy)}`)
      console.log(e)
      throw ServerError('Server error. Try again.')
    }
  }

  return {
    create,
  }
}
