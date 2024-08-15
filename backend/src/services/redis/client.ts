import { createClient } from 'redis'
import { createLogger } from '@root/utils/config/config'
import Logger from 'bunyan'

export type RedisClient = ReturnType<typeof createClient>

export const getRedisClient = (url: string): RedisClient => {
  const log: Logger = createLogger('RedisConnectionLogger')

  const client = createClient({
    url,
  })

  client.on('error', (error: unknown) => {
      log.error(`Redis Error ${JSON.stringify(error)}`)
    })
    .on('connect', () => {
      log.info(`Redis ready to go ${url}`)
    })
    .on('end', () => {
      log.info(`Redis connection ended on ${url}`)
    })
    .connect()

  return client;


}
