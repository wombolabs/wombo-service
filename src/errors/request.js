/* eslint-disable max-classes-per-file */
class RequestError extends Error {
  constructor(name, message, statusCode, stack) {
    super()
    this.name = name ?? 'RequestError'
    this.message = message ?? 'Bad request.'
    this.statusCode = statusCode ?? 400
    this.stack = stack
    Error.captureStackTrace(this, RequestError)
  }
}

class InsufficientDataError extends RequestError {
  constructor(message, statusCode, stack) {
    super('InsufficientDataError', message ?? 'Insufficient data to fulfill the request.', statusCode, stack)
    Error.captureStackTrace(this, InsufficientDataError)
  }
}

class ForbiddenDataError extends RequestError {
  constructor(message, statusCode, stack) {
    super('ForbiddenDataError', message ?? 'Forbidden data in request.', statusCode, stack)
    Error.captureStackTrace(this, ForbiddenDataError)
  }
}

class ResourceNotFoundError extends RequestError {
  constructor(message, statusCode, stack) {
    super('ResourceNotFoundError', message ?? 'The requested resource does not exist.', statusCode ?? 404, stack)
    Error.captureStackTrace(this, ResourceNotFoundError)
  }
}

class DuplicateResourceError extends RequestError {
  constructor(message, statusCode, stack) {
    super('DuplicateResourceError', message ?? 'Resource already exists.', statusCode ?? 409, stack)
    Error.captureStackTrace(this, DuplicateResourceError)
  }
}

class UnsupportedMediaTypeError extends RequestError {
  constructor(message, statusCode, stack) {
    super('UnsupportedMediaTypeError', message ?? 'Media type not supported.', statusCode ?? 415, stack)
    Error.captureStackTrace(this, UnsupportedMediaTypeError)
  }
}

class MethodNotAllowedError extends RequestError {
  constructor(message, statusCode, stack) {
    super('MethodNotAllowedError', message ?? 'Method not allowed.', statusCode ?? 405, stack)
    Error.captureStackTrace(this, MethodNotAllowedError)
  }
}

export {
  RequestError,
  ForbiddenDataError,
  ResourceNotFoundError,
  InsufficientDataError,
  DuplicateResourceError,
  UnsupportedMediaTypeError,
  MethodNotAllowedError,
}
