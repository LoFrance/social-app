import { getQueue } from './queue'
import { Queue as Queuetype } from 'bull'
import { userWorker } from '@services/workers/user'

const addUserJob = (queue: Queuetype) => (name: string, data: unknown) => {
  queue.add(name, data)
}

export const userQueue = () => {
  console.log('BUILDING QUEUE USER')
  const userQueue = getQueue('user')

  userQueue.processJob(userQueue.queue)('addUserToDB', 5, userWorker().addUserToDb)

  return {
    addUserJob: addUserJob(userQueue.queue),
    getRouter: userQueue.getRouter,
  }
}
