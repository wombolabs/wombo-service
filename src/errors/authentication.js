/* eslint-disable max-classes-per-file */

class AuthenticationError extends Error {
  constructor(message = 'Authentication failed.', statusCode = 401) {
    super()
    this.name = 'AuthenticationError'
    this.message = message
    this.statusCode = statusCode
    Error.captureStackTrace(this, AuthenticationError)
  }
}

class UnauthenticatedAccessError extends AuthenticationError {
  constructor(...args) {
    super(...args)
    this.name = 'UnauthenticatedAccessError'
    this.message = 'Authentication required.'
    this.statusCode = 401
    Error.captureStackTrace(this, UnauthenticatedAccessError)
  }
}

class TokenExpiredError extends AuthenticationError {
  constructor(...args) {
    super(...args)
    this.name = 'TokenExpiredError'
    this.message = 'Authentication token has expired.'
    this.statusCode = 401
    Error.captureStackTrace(this, TokenExpiredError)
  }
}

class TokenCorruptedError extends AuthenticationError {
  constructor(...args) {
    super(...args)
    this.name = 'TokenCorruptedError'
    this.message = 'Authentication token has been corrupted.'
    this.statusCode = 401
    Error.captureStackTrace(this, TokenCorruptedError)
  }
}

export { AuthenticationError, UnauthenticatedAccessError, TokenExpiredError, TokenCorruptedError }
