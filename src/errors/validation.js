export class ValidationError extends Error {
  constructor(errors, message = 'Validation Failed', statusCode = 400) {
    super()
    this.name = 'ValidationError'
    this.message = message
    this.statusCode = statusCode
    this.details = errors
    Error.captureStackTrace(this, ValidationError)
  }
}
