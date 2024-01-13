import serverlessExpress from '@codegenie/serverless-express'
import express from 'express'
import helmet from 'helmet'
import Router from 'express-promise-router'
import { queryParser } from 'express-query-parser'
import { wrapHandler } from '~/services/sentry'
import { errorMiddleware, validationMiddleware, prismaErrorMiddleware } from '~/middlewares'

/**
 * @callback handlerCallback
 * @param {object} req
 * @param {object} res
 */

/**
 * @callback expressHandlerCallback
 */

/**
 * Builds a handler using express-serverless, express's promise router and some
 * common middlewares.
 * @param {string} route - route for the handler
 * @param {string} method - method the handler should respond to (eg. 'get')
 * @param {handlerCallback} handler - handler function
 * @param {object} [options] - options for the handler, including any extra options for serverless express
 * @returns {expressHandlerCallback} handler to be used by AWS lambda
 */
export const buildHandler = (
  route,
  method,
  handler,
  { middlewares = [validationMiddleware], ...proxyOptions } = {}
) => {
  const app = express()
  const router = Router()

  router[method](route, ...middlewares, handler)

  app.use(queryParser({ parseBoolean: true }))
  app.use(helmet())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true })) // support encoded bodies
  app.use(router)
  app.use(prismaErrorMiddleware)
  app.use(errorMiddleware)

  return wrapHandler(serverlessExpress({ app, ...proxyOptions }))
}
