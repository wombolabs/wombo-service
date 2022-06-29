/* eslint-disable max-classes-per-file */
export class PrismaError extends Error {
  constructor(message, statusCode, cause) {
    super()
    this.name = 'PrismaError'
    this.message = message ?? 'Prisma internal error.'
    this.statusCode = statusCode ?? 500
    this.cause = cause
    Error.captureStackTrace(this, PrismaError)
  }
}

export class PrismaValidationError extends PrismaError {
  constructor(message, statusCode, cause) {
    super(message, statusCode, cause)
    this.name = 'PrismaValidationError'
    this.message = message ?? 'Missing field or incorrect field type.'
    this.statusCode = statusCode ?? 412
    Error.captureStackTrace(this, PrismaValidationError)
  }
}

export class PrismaUnknownError extends PrismaError {
  constructor(message, statusCode, cause) {
    super(message, statusCode, cause)
    this.name = 'PrismaUnknownError'
    this.message = message ?? 'Internal database error.'
    this.statusCode = statusCode ?? 500
    Error.captureStackTrace(this, PrismaUnknownError)
  }
}
