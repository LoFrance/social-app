import { createLogger } from '@config/config'
import { authService } from '@services/db/auth'
import { DoneCallback, Job } from 'bull'
import Logger from 'bunyan'

const log: Logger = createLogger('workerAuthLogger')

export const authWorker = () => {
  return {
    addAuthUserToDb,
  }
}

const addAuthUserToDb = async (job: Job, done: DoneCallback) => {
  try {
    const { value } = job.data
    log.info(`Save data to DB ${value}`)
    await authService().addAuthUser(value)
    job.progress(100)
    done(null, job.data)
  } catch (error) {
    log.error(error)
    done(error as Error)
  }
}
