import { z } from 'zod'
import { fromError } from 'zod-validation-error'
import dotenv from 'dotenv'
import bunyan from 'bunyan'
import Logger from 'bunyan'
import { getRedisValue, Redis } from './redisConfig'
import { getMongoDbValue, Mongo } from './mongoDbConfig'
import { Cookie, getCookieValue } from './cookieConfig'
import { getServeValue, Server } from './serverConfig'
import { Cloudinary, getCloudinaryValue } from './cloudinaryConfig'

dotenv.config({})

// Logger

export const createLogger = (name: string) => {
  return bunyan.createLogger({
    name,
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  })
}

const log: Logger = createLogger('routesLogger')

export type Config = {
  cookie: Cookie
  server: Server
  mongodb: Mongo
  redis: Redis
  cloudinary: Cloudinary
}

const printZodError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    // log.error("Validation failed: ", error.issues[0]);
    const validationError = fromError(error)

    log.error(validationError.toString())
    // or return it as an actual error
    return validationError
  } else {
    log.error('Unexpected error: ', error)
    return error
  }
}

type FunctionReturnCookie = () => Cookie
type FunctionReturnServer = () => Server
type FunctionReturnMongo = () => Mongo
type FunctionReturnRedis = () => Redis
type FunctionReturnCloduinary = () => Cloudinary
type FunctionEnvReturn =
  | FunctionReturnCookie
  | FunctionReturnServer
  | FunctionReturnMongo
  | FunctionReturnRedis
  | FunctionReturnCloduinary

const getEnvVars = <T extends FunctionEnvReturn>(f: T) => {
  try {
    return {
      ...f(),
    } as ReturnType<T>
  } catch (error) {
    printZodError(error)
    throw error
  }
}

export const getConfigOrThrow = (): Error | Config => {
  try {
    return {
      cookie: getEnvVars(getCookieValue),
      server: getEnvVars(getServeValue),
      mongodb: getEnvVars(getMongoDbValue),
      redis: getEnvVars(getRedisValue),
      cloudinary: getEnvVars(getCloudinaryValue),
    }
  } catch (e: unknown) {
    return Error(`Invalid Configuration - check you env file ${e}`)
  }
}

export const getConfig = (): Config => {
  return {
    cookie: getEnvVars(getCookieValue),
    server: getEnvVars(getServeValue),
    mongodb: getEnvVars(getMongoDbValue),
    redis: getEnvVars(getRedisValue),
    cloudinary: getEnvVars(getCloudinaryValue),
  }
}