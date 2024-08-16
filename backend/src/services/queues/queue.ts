import { createLogger } from '@config/config'
import Queue, { Job,ProcessCallbackFunction,  Queue as Queuetype  } from 'bull'
import Logger from 'bunyan'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { getConfigOrThrow } from '@config/config'
import { IAuthJob } from '@auth/interfaces/auth'

type IJobData =
 | IAuthJob

const config = getConfigOrThrow()
if (config instanceof Error) {
  throw new Error(config.message)
}

const log: Logger = createLogger('queueLogger')

let bullAdapters: BullAdapter[] = []

export let serverAdapter: ExpressAdapter

export const getQueue = (queueName: string) => {
  const queue = new Queue(queueName, `${config.redis.host}`)
  bullAdapters.push(new BullAdapter(queue))
  bullAdapters = [...new Set(bullAdapters)]
  serverAdapter = new ExpressAdapter()
  serverAdapter.setBasePath('/queues')

  // Create UI Board to monitoring queue
  createBullBoard({
    queues: bullAdapters,
    serverAdapter,
  })

  log.info(`${queueName} built`)

  // Listening for events
  queue
    .on('completes', (job: Job) => {
      job.remove()
      log.info(`Job done from Queue: ${queueName}`)
    })
    .on('global:completes', (jobId: string) => {
      log.info(`Job ${jobId} removed from Queue: ${queueName}`)
    })
    .on('global:stalled', (jobId: string) => {
      log.warn(`Job ${jobId} is stalled`)
    })

  return { queue, getRouter: () => serverAdapter.getRouter() }
}

const addJob = (queue: Queuetype) => (name: string, data: IJobData) => {
  queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } })
}

const processJob =
  (queue: Queuetype) =>
  (name: string, concurrency: number, callback: ProcessCallbackFunction<void>) => {
    queue.process(name, concurrency, callback)
  }
