import express, { Express } from 'express'
import { getServer } from '@root/utils/setupServers'
import { createLogger, getConfigOrThrow } from '@root/utils/config/config'
import databaseConnection from '@root/utils/setupDatabase'
import Logger from 'bunyan'
import { setCloudinaryConfig } from './utils/config/cloudinaryConfig'

const log: Logger = createLogger('appLogger')

const config = getConfigOrThrow()
try {
  if (config instanceof Error) {
    throw new Error(config.message)
  }

  const app: Express = express()

  databaseConnection(config)
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
