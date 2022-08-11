export class ValidationError extends Error {
  constructor(errors, message, statusCode) {
    super()
    this.name = 'ValidationError'
    this.message = message ?? 'Validation Failed'
    this.statusCode = statusCode ?? 400
    this.details = errors
    Error.captureStackTrace(this, ValidationError)
  }
}
