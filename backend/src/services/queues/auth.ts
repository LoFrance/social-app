import { IAuthJob } from '@auth/interfaces/auth'
import { getQueue } from './queue'
import { Queue as Queuetype } from 'bull'
import { authWorker } from '@services/workers/auth'

const addAuthJob = (queue: Queuetype) => (name: string, data: IAuthJob) => {
  queue.add(name, data)
}

export const authQueue = () => {
  console.log('BUILDING QUEUE AUTH')
  const authQueue = getQueue('auth')

  authQueue.processJob(authQueue.queue)('addAuthUserToDB', 5, authWorker().addAuthUserToDb)

  return {
    addAuthJob: addAuthJob(authQueue.queue),
    getRouter: authQueue.getRouter,
  }
}
