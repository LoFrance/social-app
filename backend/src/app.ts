import express, { Express } from 'express'
import { getServer } from '@root/utils/setupServers'
import { createLogger, getConfigOrThrow } from '@root/utils/config'
import databaseConnection from '@root/utils/setupDatabase'
import Logger from 'bunyan'

const log: Logger = createLogger('appLogger')

const config = getConfigOrThrow()
try {
  if (config instanceof Error) {
    throw new Error(config.message)
  }

  const app: Express = express()

  databaseConnection(config)

  const server = getServer(app, config)
  server.start()
} catch (e) {
  log.error(e)
}
