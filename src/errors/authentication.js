/* eslint-disable max-classes-per-file */
class AuthenticationError extends Error {
  constructor(name, message, statusCode, stack) {
    super()
    this.name = name ?? 'AuthenticationError'
    this.message = message ?? 'Authentication failed.'
    this.statusCode = statusCode ?? 401
    this.stack = stack
    Error.captureStackTrace(this, AuthenticationError)
  }
}

class UnauthenticatedAccessError extends AuthenticationError {
  constructor(message, statusCode, stack) {
    super('UnauthenticatedAccessError', message ?? 'Authentication required.', statusCode, stack)
    Error.captureStackTrace(this, UnauthenticatedAccessError)
  }
}

class TokenExpiredError extends AuthenticationError {
  constructor(message, statusCode, stack) {
    super('TokenExpiredError', message ?? 'Authentication token has expired.', statusCode, stack)
    Error.captureStackTrace(this, TokenExpiredError)
  }
}

class TokenCorruptedError extends AuthenticationError {
  constructor(message, statusCode, stack) {
    super('TokenCorruptedError', message ?? 'Authentication token has been corrupted.', statusCode, stack)
    Error.captureStackTrace(this, TokenCorruptedError)
  }
}

export { AuthenticationError, UnauthenticatedAccessError, TokenExpiredError, TokenCorruptedError }
