import { Prisma } from '@prisma/client'

import { DuplicateResourceError, PrismaError, PrismaValidationError, ResourceNotFoundError } from '~/errors'

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
    if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
      throw new DuplicateResourceError('The username already exists.', null, error)
    }
    if (error.code === 'P2002') {
      throw new DuplicateResourceError(null, null, error)
    } else if (error.code === 'P2025') {
      throw new ResourceNotFoundError(null, null, error)
    }
    throw new PrismaError(null, null, error)
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    throw new PrismaValidationError(null, null, error)
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new PrismaError(null, null, error)
  }

  next(error)
}
