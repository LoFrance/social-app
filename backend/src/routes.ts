import { BadRequestError } from '@lfapp/shared-globals-handlers'
import express, { Application } from 'express'
import Logger from 'bunyan'
import { createLogger } from './utils/config/config'

const log: Logger = createLogger('routesLogger')

const router = express.Router()
const BASE_PATH = '/api/v1'

// dall'esempio della guida di Express
router.use(function timeLog(_req, _res, next) {
  const currentDate = new Date()
  log.info(
    `Ricevuta chiamata :: ${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`
  )
  next()
})

router.get('/test', (req, res) => {
  if (req.query.check !== 'true') {
    throw BadRequestError('Need a parameter check with value at true')
  } else {
    return res.status(200).json({ message: 'test ok' })
  }
})

export default (app: Application) => {
  const routes = () => {
    app.use(BASE_PATH, router)
  }
  routes()
}
