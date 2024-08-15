import { z } from 'zod'

const RedisEnvSchema = z.object({
  host: z.string(),
})
export type Redis = z.infer<typeof RedisEnvSchema>

export const getRedisValue = () =>
  RedisEnvSchema.parse({
    host: z.string().parse(process.env.REDIS_HOST),
  })