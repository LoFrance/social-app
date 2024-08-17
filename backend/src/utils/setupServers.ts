/* eslint-disable sort-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Application, json, urlencoded, Response, Request, NextFunction } from 'express'
import http from 'http'
import cors from 'cors'
// security library
import helmet from 'helmet'
import hpp from 'hpp'
import compression from 'compression'
import cookieSession from 'cookie-session'
import HTTP_STATUS from 'http-status-codes'
import 'express-async-errors'
import { Config, createLogger } from '@config/config'
import applicationRoutes from '@root/routes'
import { IErrorResponse, isCustomError, NotFoundError } from '@lfapp/shared-globals-handlers'
import Logger from 'bunyan'

const log: Logger = createLogger('setupServerLogger')

const securityMiddleware = (app: Application, config: Config): void => {
  app.use(
    cookieSession({
      name: config.server.sessionName,
      keys: [config.server.secretKeyOne, config.server.secretKeyTwo],
      maxAge: config.cookie.maxAge,
      secure: config.cookie.isSecure,
    })
  )
  app.use(hpp())
  app.use(helmet())
  app.use(
    cors({
      origin: config.server.clientURL,
      credentials: true,
      optionsSuccessStatus: 200, // for old browser
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
  )
}

const standardMiddleware = (app: Application) => {
  app.use(compression())
  app.use(
    json({
      limit: '50mb',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      verify: function (req: Request & { rawBody: any }, res: Response, buffer) {
        req.rawBody = buffer
        try {
          JSON.parse(req.rawBody)
        } catch (e) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: 'Please verify your JSON',
          })
        }
      },
    })
  )
  app.use(
    urlencoded({
      extended: true,
      limit: '50mb',
    })
  )
}

const routeMiddleware = (app: Application) => {
  applicationRoutes(app)
}

const globalErrorHandler = (app: Application) => {
  // Catch errors for URL non available
  app.all('*', (req: Request, _res: Response) => {
    log.error(`Request URL '${req.originalUrl}' not found`)
    throw NotFoundError(`Request URL '${req.originalUrl}' not found`)
  })

  // Custom Error
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.error(`Catched error: ${JSON.stringify(error)}`)
    if (isCustomError(error)) {
      log.error(`Is a Custom Error ;) ${JSON.stringify(error.serializeErrors())}`)
      res.status(error.statusCode).json(error.serializeErrors())
    } else {
      log.warn('Not a custom error')
    }
    next()
  })
}

const startHttpServer = (app: Application, config: Config): void => {
  try {
    const httpServer: http.Server = new http.Server(app)
    createHttpServer(httpServer, config)
  } catch (error) {
    log.error(error)
  }
}

const startServer = (app: Application, config: Config) => {
  securityMiddleware(app, config)
  standardMiddleware(app)
  routeMiddleware(app)
  globalErrorHandler(app)
  startHttpServer(app, config)
}

const createSocketIO = (httpServer: http.Server) => {}

const createHttpServer = (httpServer: http.Server, config: Config) => {
  const PORT = config.server.port || 5000
  httpServer.listen(PORT, () => {
    log.info(`Server Running ${PORT}`)
  })
}

export const getServer = (app: Application, config: Config) => {
  return {
    start: () => startServer(app, config),
  }
}
