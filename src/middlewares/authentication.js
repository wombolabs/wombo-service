import * as Sentry from '@sentry/serverless'
import jwt from 'jsonwebtoken'
import { jwt as jwtConfig } from '~/config'
import {
  AuthenticationError,
  UnauthenticatedAccessError,
  TokenExpiredError,
  TokenCorruptedError,
  ResourceNotFoundError,
} from '~/errors'
import { getStudentById } from '~/services/students'

/**
 * Verifies an access token and returns the associated user's data
 * @param {string} token - JWT access token
 * @returns {Object} Authenticated user
 */
const validate = async (token) => {
  try {
    if (!token) {
      throw new UnauthenticatedAccessError()
    }

    const claims = jwt.verify(token, jwtConfig.secret, jwtConfig.options.verify)

    return await getStudentById(claims.id)
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }

    // Token has expired
    if (error instanceof jwt.TokenExpiredError) {
      throw new TokenExpiredError()
    }

    // Token is malformed or otherwise invalid
    if (error instanceof jwt.JsonWebTokenError) {
      throw new TokenCorruptedError()
    }

    // User doesn't exist
    if (error instanceof ResourceNotFoundError) {
      throw new TokenCorruptedError()
    }

    throw new AuthenticationError()
  }
}

/**
 * Enforces authentication.
 * The provided access token will be verified and the user's information will be made available on the request object.
 * @param {import('express').Request} req - Request object
 * @param {import('express').Response} res - Response object
 * @param {import('express').NextFunction} next - Callback function
 */
export const authenticationMiddleware = async (req, res, next) => {
  const token = req.get('x-access-token')
  const user = await validate(token)
  req.user = user // eslint-disable-line no-param-reassign

  Sentry.setUser({
    id: user.id,
    email: user.email,
  })

  next()
}
