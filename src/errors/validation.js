/* eslint-disable max-classes-per-file */
class ValidationError extends Error {
  constructor(errors, message, statusCode, stack) {
    super()
    this.name = 'ValidationError'
    this.message = message ?? 'Validation failed.'
    this.statusCode = statusCode ?? 400
    this.stack = stack
    this.details = errors
    Error.captureStackTrace(this, ValidationError)
  }
}

export { ValidationError }
