import { IAuthJob } from '@auth/interfaces/auth'
import { getQueue } from './queue'
import { Queue as Queuetype } from 'bull'

const addAuthJob = (queue: Queuetype) => (name: string, data: IAuthJob) => {
  queue.add(name, data)
}

export const authQueue = () => {
  const authQueue = getQueue('auth')

  return {
    addAuthJob: addAuthJob(authQueue.queue),
    getRouter: authQueue.getRouter
  }
}
