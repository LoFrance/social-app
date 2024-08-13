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
import { Config } from '@lfapp/backend/src/utils/config'

const securityMiddleware = (app: Application, config: Config): void => {
  app.use(
    cookieSession({
      name: config.server.sessionName,
      keys: [config.server.secretKeyOne, config.server.secretKeyTwo],
      maxAge: config.cookie.maxAge,
      secure: config.cookie.isSecure,
    }),
  )
  app.use(hpp())
  app.use(helmet())
  app.use(
    cors({
      origin: config.server.clientURL,
      credentials: true,
      optionsSuccessStatus: 200, // for old browser
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  )
}

const standardMiddleware = (app: Application) => {
  app.use(compression())
  app.use(
    json({
      limit: '50mb',
    }),
  )
  app.use(
    urlencoded({
      extended: true,
      limit: '50mb',
    }),
  )
}

const routeMiddleware = (app: Application) => {}

const globalErrorHandler = (app: Application) => {}

const startHttpServer = (app: Application, config: Config): void => {
  try {
    const httpServer: http.Server = new http.Server(app)
    createHttpServer(httpServer, config)
  } catch (error) {
    console.log(error)
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
    console.log(`Server Running ${PORT}`)
  })
}

export const getServer = (app: Application, config: Config) => {
  return {
    start: () => startServer(app, config),
  }
}
