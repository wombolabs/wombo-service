/* eslint-disable max-classes-per-file */
class RequestError extends Error {
  constructor(message, statusCode, cause) {
    super()
    this.name = 'RequestError'
    this.message = message ?? 'Bad request.'
    this.statusCode = statusCode ?? 400
    this.cause = cause
    Error.captureStackTrace(this, RequestError)
  }
}

class InsufficientDataError extends RequestError {
  constructor(message, statusCode, cause) {
    super(message, statusCode, cause)
    this.name = 'InsufficientDataError'
    this.message = message ?? 'Insufficient data to fulfill the request.'
    this.statusCode = statusCode ?? 400
    Error.captureStackTrace(this, InsufficientDataError)
  }
}

class ForbiddenDataError extends RequestError {
  constructor(message, statusCode, cause) {
    super(message, statusCode, cause)
    this.name = 'ForbiddenDataError'
    this.message = message ?? 'Forbidden data in request.'
    this.statusCode = statusCode ?? 400
    Error.captureStackTrace(this, ForbiddenDataError)
  }
}

class ResourceNotFoundError extends RequestError {
  constructor(message, statusCode, cause) {
    super(message, statusCode, cause)
    this.name = 'ResourceNotFoundError'
    this.message = message ?? 'The requested resource does not exist.'
    this.statusCode = statusCode ?? 404
    Error.captureStackTrace(this, ResourceNotFoundError)
  }
}

export class DuplicateResourceError extends RequestError {
  constructor(message, statusCode, cause) {
    super(message, statusCode, cause)
    this.name = 'DuplicateResourceError'
    this.message = message ?? 'Resource already exists.'
    this.statusCode = statusCode ?? 409
    Error.captureStackTrace(this, DuplicateResourceError)
  }
}

class UnsupportedMediaTypeError extends RequestError {
  constructor(message, statusCode, cause) {
    super(message, statusCode, cause)
    this.name = 'UnsupportedMediaTypeError'
    this.message = message ?? 'Media type not supported.'
    this.statusCode = statusCode ?? 415
    Error.captureStackTrace(this, UnsupportedMediaTypeError)
  }
}

class MethodNotAllowedError extends RequestError {
  constructor(message, statusCode, cause) {
    super(message, statusCode, cause)
    this.name = 'MethodNotAllowedError'
    this.message = message ?? 'Method not allowed.'
    this.statusCode = statusCode ?? 405
    Error.captureStackTrace(this, MethodNotAllowedError)
  }
}

export {
  RequestError,
  ForbiddenDataError,
  ResourceNotFoundError,
  InsufficientDataError,
  UnsupportedMediaTypeError,
  MethodNotAllowedError,
}
