import { createLogger } from '@config/config'
import { userService } from '@services/db/user'
import { DoneCallback, Job } from 'bull'
import Logger from 'bunyan'

const log: Logger = createLogger('workerUserLogger')

export const userWorker = () => {
  return {
    addUserToDb,
  }
}

const addUserToDb = async (job: Job, done: DoneCallback) => {
  try {
    const { value } = job.data
    log.info(`Save data to DB ${value}`)
    await userService().addUser(value)
    job.progress(100)
    done(null, job.data)
  } catch (error) {
    log.error(error)
    done(error as Error)
  }
}
