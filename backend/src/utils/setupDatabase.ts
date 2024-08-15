import mongoose from 'mongoose'
import { Config, createLogger } from '@root/utils/config/config'
import Logger from 'bunyan'

const log: Logger = createLogger('setupDatabaseLogger')

export default (config: Config) => {
  const connect = () => {
    log.info(`Trying to connect to ${config.mongodb.host} on ${config.mongodb.dbname}`)
    mongoose
      .connect(`mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.dbname}`)
      .then(() => {
        log.info(`Successfully connected to database ${config.mongodb.dbname}`)
      })
      .catch((error) => {
        log.error(`Error connecting to database ${error}`)
        return process.exit(1)
      })
  }
  connect()

  mongoose.connection.on('disconnected', connect)
}
