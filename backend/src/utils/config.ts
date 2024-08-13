import { z } from 'zod'
import { fromError } from 'zod-validation-error'
import dotenv from 'dotenv'

dotenv.config({})

const ServerEnvSchema = z.object({
  port: z.number().refine((val) => val > 1024, { message: 'Port must be over 1024' }),
  secretKeyOne: z.string(),
  secretKeyTwo: z.string(),
  sessionName: z.string(),
  clientURL: z.string(),
})
type Server = z.infer<typeof ServerEnvSchema>

const CookieEnvSchema = z.object({
  maxAge: z.number(),
  isSecure: z.boolean(),
})
type Cookie = z.infer<typeof CookieEnvSchema>

const MongoDbEnvSchema = z.object({
  host: z.string(),
  port: z.number().refine((val) => val > 1024, { message: 'Port must be over 1024' }),
  dbname: z.string(),
})
type Mongo = z.infer<typeof MongoDbEnvSchema>

export type Config = { cookie: Cookie; server: Server; mongodb: Mongo }

const printZodError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    // console.error("Validation failed: ", error.issues[0]);
    const validationError = fromError(error)

    console.error(validationError.toString())
    // or return it as an actual error
    return validationError
  } else {
    console.error('Unexpected error: ', error)
    return error
  }
}

const getServeValue = () =>
  ServerEnvSchema.parse({
    port: parseInt(z.string().parse(process.env.PORT || 3000), 10),
    secretKeyOne: z.string().parse(process.env.SECRET_KEY_ONE),
    secretKeyTwo: z.string().parse(process.env.SECRET_KEY_TWO),
    sessionName: z.string().parse(process.env.SESSION_NAME),
    clientURL: z.string().parse(process.env.CLIENT_URL),
  })

const getCookieValue = () =>
  CookieEnvSchema.parse({
    maxAge: parseInt(z.string().parse(process.env.MAX_AGE), 10),
    isSecure: process.env.NODE_ENV !== 'development',
  })

const getMongoDbValue = () =>
  MongoDbEnvSchema.parse({
    host: z.string().parse(process.env.MONGO_DB_HOST),
    port: parseInt(z.string().parse(process.env.MONGO_DB_PORT), 10),
    dbname: z.string().parse(process.env.MONGO_DB_NAME),
  })

type FunctionReturnCookie = () => Cookie
type FunctionReturnServer = () => Server
type FunctionReturnMongo = () => Mongo
type FunctionEnvReturn = FunctionReturnCookie | FunctionReturnServer | FunctionReturnMongo

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
    }
  } catch (e: unknown) {
    return Error(`Invalid Configuration - check you env file ${e}`)
  }
}
