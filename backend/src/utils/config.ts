import { z } from 'zod'

const ServerEnvSchema = z.object({
  port: z.number(),
})
type Server = z.infer<typeof ServerEnvSchema>

const CookieEnvSchema = z.object({
  maxAge: z.number(),
  isSecure: z.boolean(),
})
type Cookie = z.infer<typeof CookieEnvSchema>

const MongoDbEnvSchema = z.object({
  host: z.string(),
  port: z.number(),
  dbname: z.string(),
})
type Mongo = z.infer<typeof MongoDbEnvSchema>

export type Config = { cookie: Cookie; server: Server; mongodb: Mongo }

const printZodError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    console.error('Validation failed: ', error.issues[0])
  } else {
    console.error('Unexpected error: ', error)
  }
}

const getServeValue = () =>
  ServerEnvSchema.parse({
    port: parseInt(z.string().parse(process.env.PORT || 3000), 10),
  })

const getCookieValue = () =>
  CookieEnvSchema.parse({
    maxAge: parseInt(z.string().parse(process.env.MAX_AGE), 10),
    isSecure: z.boolean().parse(Boolean(process.env.SESSION_IS_SECURE?.toLocaleLowerCase())),
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
    throw new Error()
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
