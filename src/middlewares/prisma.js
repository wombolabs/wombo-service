import { DuplicateResourceError, PrismaValidationError, PrismaError } from '~/errors'
import { Prisma } from '@prisma/client'

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
export function prismaErrorMiddleware(error, req, res, next) {
  // eslint-disable-line no-unused-vars
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new DuplicateResourceError(error.message)
    }
    throw new PrismaError(error.message)
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    throw new PrismaValidationError(error.message)
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new PrismaError(error.message)
  }

  next(error)
}
