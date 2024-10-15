/* eslint-disable max-classes-per-file */
class PrismaError extends Error {
  constructor(name, message, statusCode, stack) {
    super()
    this.name = name ?? 'PrismaError'
    this.message = message ?? 'Internal database error.'
    this.statusCode = statusCode ?? 500
    this.stack = stack
    Error.captureStackTrace(this, PrismaError)
  }
}

class PrismaValidationError extends PrismaError {
  constructor(message, statusCode, stack) {
    super('PrismaValidationError', message ?? 'Missing field or incorrect field type.', statusCode ?? 412, stack)
    Error.captureStackTrace(this, PrismaValidationError)
  }
}

class PrismaUnknownError extends PrismaError {
  constructor(message, statusCode, stack) {
    super('PrismaUnknownError', message, statusCode, stack)
    Error.captureStackTrace(this, PrismaUnknownError)
  }
}

export { PrismaError, PrismaUnknownError, PrismaValidationError }
