import express, { Express } from 'express'
import { getServer } from '@utils/setupServers'
import { createLogger, getConfigOrThrow } from '@config/config'
import databaseConnection from '@utils/setupDatabase'
import Logger from 'bunyan'
import { setCloudinaryConfig } from '@config/cloudinaryConfig'
import { getRedisClient } from '@services/redis/client'

const log: Logger = createLogger('appLogger')

const config = getConfigOrThrow()

const app = async () => {
  try {
    if (config instanceof Error) {
      throw new Error(config.message)
    }

    const app: Express = express()

    databaseConnection(config)

    const redisClient = getRedisClient(config.redis.host)
    const res = await redisClient.ping()
    log.info(`Ping: Redis reply with ${res}`)
    await redisClient.disconnect()

    setCloudinaryConfig({
      cloud_name: config.cloudinary.cloud_name,
      api_key: config.cloudinary.app_key,
      api_secret: config.cloudinary.app_secret,
    })

    const server = getServer(app, config)
    server.start()
  } catch (e) {
    log.error(e)
  }
}

app()
