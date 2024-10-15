import * as Sentry from '@sentry/serverless'
import jwt from 'jsonwebtoken'

import {
  AuthenticationError,
  ResourceNotFoundError,
  TokenCorruptedError,
  TokenExpiredError,
  UnauthenticatedAccessError,
} from '~/errors'
import { getStudentById } from '~/services/students'
import { isNilOrEmpty } from '~/utils/isNilOrEmpty'
import { jwtVerify } from '~/utils/jwt'

/**
 * Verifies an access token and returns the associated user's data
 * @param {string} token - JWT access token
 * @returns {Object} Authenticated user
 */
const validate = async (token) => {
  try {
    if (isNilOrEmpty(token)) {
      throw new UnauthenticatedAccessError()
    }

    const claims = await jwtVerify(token)

    const user = await getStudentById(claims.id)

    if (!user.email.includes('@wombo.gg')) {
      throw new AuthenticationError()
    }

    return user
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }

    // Token has expired
    if (error instanceof jwt.TokenExpiredError) {
      throw new TokenExpiredError(null, null, error)
    }

    // Token is malformed or otherwise invalid
    if (error instanceof jwt.JsonWebTokenError) {
      throw new TokenCorruptedError(null, null, error)
    }

    // User doesn't exist
    if (error instanceof ResourceNotFoundError) {
      throw new TokenCorruptedError(null, null, error)
    }

    throw new AuthenticationError(null, null, error)
  }
}

/**
 * Enforces authentication.
 * The provided access token will be verified and the user's information will be made available on the request object.
 * @param {import('express').Request} req - Request object
 * @param {import('express').Response} res - Response object
 * @param {import('express').NextFunction} next - Callback function
 */
export const authenticationInternalMiddleware = async (req, res, next) => {
  const token = req.get('x-access-token')
  const user = await validate(token)
  req.user = user // eslint-disable-line no-param-reassign

  Sentry.setUser({
    id: user.id,
    email: user.email,
  })

  next()
}
