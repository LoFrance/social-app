import { z } from "zod";
import { fromError } from 'zod-validation-error';

const ServerEnvSchema = z.object({
  port: z.number().refine(val => val > 1024, {message: "Port must be over 1024"})
});
type Server = z.infer<typeof ServerEnvSchema>;

const CookieEnvSchema = z.object({
  maxAge: z.number(),
  isSecure: z.boolean()
});
type Cookie = z.infer<typeof CookieEnvSchema>;

const MongoDbEnvSchema = z.object({
  host: z.string(),
  port: z.number().refine(val => val > 1024, {message: "Port must be over 1024"}),
  dbname: z.string()
});
type Mongo = z.infer<typeof MongoDbEnvSchema>;

export type Config = {cookie: Cookie, server: Server, mongodb: Mongo};

const printZodError = (error: any) => {
  if (error instanceof z.ZodError) {
    // console.error("Validation failed: ", error.issues[0]);
    const validationError = fromError(error);

    console.error(validationError.toString());
    // or return it as an actual error
    return validationError;
  } else {
    console.error("Unexpected error: ", error);
    return error;
  }
}

const getServeValue = () => {
  const serverEnvVars = ServerEnvSchema.parse({
    port: parseInt(z.string().parse(process.env.PORT || 3000), 10)
  })

  process.env.DEBUG && console.debug("Server Validation passed: ", serverEnvVars);

  return {
    port: serverEnvVars.port
  }
}

const getCookieValue = () => {
  const cookieEnvVars = CookieEnvSchema.parse({
    maxAge: parseInt(z.string().parse(process.env.MAX_AGE), 10),
    isSecure: z.boolean().parse(Boolean(process.env.SESSION_IS_SECURE?.toLocaleLowerCase()))
  })

  process.env.DEBUG && console.debug("Cookie Validation passed: ", cookieEnvVars);

  return {
    maxAge: cookieEnvVars.maxAge,
    isSecure: cookieEnvVars.isSecure
  }
}

const getMongoDbValue = () => {
  const mongoDbEnvVars = MongoDbEnvSchema.parse({
    host: z.string().parse(process.env.MONGO_DB_HOST),
    port: parseInt(z.string().parse(process.env.MONGO_DB_PORT), 10),
    dbname: z.string().parse(process.env.MONGO_DB_NAME)
  })

  process.env.DEBUG && console.debug("Mongo Db Validation passed: ", mongoDbEnvVars);

  return {
    host: mongoDbEnvVars.host,
    port: mongoDbEnvVars.port,
    dbname: mongoDbEnvVars.dbname
  }
}

type FunctionReturnCookie = () => Cookie;
type FunctionReturnServer = () => Server;
type FunctionReturnMongo= () => Mongo;
type FunctionEnvReturn = FunctionReturnCookie | FunctionReturnServer | FunctionReturnMongo

const getEnvVars = <T extends FunctionEnvReturn >(f: T) => {
  try {
    return {
      ...f()
    } as ReturnType<T>;
  } catch (error) {
      printZodError(error);
      throw error;
  }
}

export const getConfigOrThrow = (): Error | Config => {
  try {
    return {
      cookie: getEnvVars(getCookieValue),
      server: getEnvVars(getServeValue),
      mongodb: getEnvVars(getMongoDbValue)
    }
  } catch(e: any) {
    return Error(`Invalid Configuration - check you env file ${e}`)
  }
}