import * as Sentry from '@sentry/serverless'
import { ValidationError } from '~/errors'

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
  if (!(error instanceof ValidationError)) {
    Sentry.captureException(error)
  }

  if (process.env.IS_OFFLINE === 'true') {
    console.error(error)
  }

  res.status(error.statusCode ?? 500).json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  })
}
