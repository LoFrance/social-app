import { z } from 'zod'

const MongoDbEnvSchema = z.object({
  host: z.string(),
  port: z.number().refine((val) => val > 1024, { message: 'Port must be over 1024' }),
  dbname: z.string(),
})
export type Mongo = z.infer<typeof MongoDbEnvSchema>

export const getMongoDbValue = () =>
  MongoDbEnvSchema.parse({
    host: z.string().parse(process.env.MONGO_DB_HOST),
    port: parseInt(z.string().parse(process.env.MONGO_DB_PORT), 10),
    dbname: z.string().parse(process.env.MONGO_DB_NAME),
  })
