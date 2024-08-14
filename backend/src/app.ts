import express, { Express } from 'express'
import { getServer } from './utils/setupServers'
import { getConfigOrThrow } from './utils/config'
import databaseConnection from './utils/setupDatabase'
import Logger from 'bunyan'
import { createLogger } from './utils/config'

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
