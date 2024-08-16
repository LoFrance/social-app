import { ServerError } from '@lfapp/shared-globals-handlers'
import { IUserDocument } from '@user/interfaces/user'
import { RedisClient } from './client'
import Logger from 'bunyan'
import { createLogger } from '@config/config'

const log: Logger = createLogger('UserRedisLogger')

export const saveUserToRedis =
  (client: RedisClient) =>
  async (key: string, userUId: string, createdUser: IUserDocument): Promise<void> => {
    const createdAt = new Date()
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageId,
      bgImageVersion,
      social,
    } = createdUser
    const dataToSave = {
      _id: `${_id}`,
      uId: `${uId}`,
      username: `${username}`,
      email: `${email}`,
      avatarColor: `${avatarColor}`,
      createdAt: `${createdAt}`,
      postsCount: `${postsCount}`,
      blocked: JSON.stringify(blocked),
      blockedBy: JSON.stringify(blockedBy),
      profilePicture: `${profilePicture}`,
      followersCount: `${followersCount}`,
      followingCount: `${followingCount}`,
      notifications: JSON.stringify(notifications),
      social: JSON.stringify(social),
      work: `${work}`,
      location: `${location}`,
      school: `${school}`,
      quote: `${quote}`,
      bgImageVersion: `${bgImageVersion}`,
      bgImageId: `${bgImageId}`,
    }

    try {
      if (!client.isOpen) {
        await client.connect()
      }
      await client.ZADD('user', { score: parseInt(userUId, 10), value: `${key}` })
      for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
        await client.HSET(`users:${key}`, `${itemKey}`, `${itemValue}`)
      }
    } catch (error) {
      log.error(error)
      throw ServerError('Server error. Try again.')
    }
  }
