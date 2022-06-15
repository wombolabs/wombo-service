/* eslint-disable max-classes-per-file */

export class PrismaError extends Error {
  constructor() {
    super()
    Error.captureStackTrace(this, PrismaError)
  }
}

export class PrismaValidationError extends PrismaError {
  constructor(message = 'Missing field or incorrect field type.', statusCode = 412) {
    super()
    this.name = 'PrismaValidationError'
    this.message = message
    this.statusCode = statusCode
    Error.captureStackTrace(this, PrismaValidationError)
  }
}

export class PrismaUnknownError extends PrismaError {
  constructor(message = 'Internal database error.', statusCode = 500) {
    super()
    this.name = 'PrismaUnknownError'
    this.message = message
    this.statusCode = statusCode
    Error.captureStackTrace(this, PrismaUnknownError)
  }
}
