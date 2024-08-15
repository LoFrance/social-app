import { z } from 'zod'

const MongoDbEnvSchema = z.object({
  protocol: z.string().default('mongodb'),
  host: z.string(),
  port: z.number().refine((val) => val > 1024, { message: 'Port must be over 1024' }),
  dbname: z.string(),
  username: z.string(),
  password: z.string(),
})
export type Mongo = z.infer<typeof MongoDbEnvSchema>

export const getMongoDbValue = () =>
  MongoDbEnvSchema.parse({
    protocol: z.string().parse(process.env.MONGO_DB_PROTOCOL),
    host: z.string().parse(process.env.MONGO_DB_HOST),
    port: parseInt(z.string().parse(process.env.MONGO_DB_PORT), 10),
    dbname: z.string().parse(process.env.MONGO_DB_NAME),
    username: z.string().parse(process.env.MONGO_DB_USERNAME),
    password: z.string().parse(process.env.MONGO_DB_PASSWORD),
  })
