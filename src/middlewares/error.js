import * as Sentry from '@sentry/serverless'
import { isOffline, isProduction } from '~/config'
import { ResourceNotFoundError, ValidationError } from '~/errors'

/**
 * @callback nextCallback
 */

/**
 * Provides error handling and automated response for a given handler
 * @param {object} error
 * @param {object} req
 * @param {object} res
 * @param {nextCallback} next
 */
// eslint-disable-next-line no-unused-vars
export function errorMiddleware(error, req, res, next) {
  if (!(error instanceof ValidationError || error instanceof ResourceNotFoundError)) {
    Sentry.captureException(error)
  }

  if (isOffline) {
    console.error(error)
  }

  res.status(error.statusCode ?? 500).json({
    message: error.message,
    stack: isProduction ? undefined : error.stack,
  })
}
